import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapaRastreio.css";

// ── ALTERADO: Conectores do WebSocket ────────────────────────────────────
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const API_BASE         = "http://localhost:8080";
const ECO_LOC          = [-9.654, -35.7315];
const ARRIVAL_M        = 60;

const truckIcon = L.divIcon({
  className: "",
  html: `<div class="mapa-icon mapa-icon--truck">🚛</div>`,
  iconSize:   [44, 44],
  iconAnchor: [22, 22],
  popupAnchor:[0, -26],
});

const clienteIcon = L.divIcon({
  className: "",
  html: `<div class="mapa-icon mapa-icon--cliente">EU</div>`,
  iconSize:   [44, 44],
  iconAnchor: [22, 44],
  popupAnchor:[0, -46],
});

function haversine([lat1, lon1], [lat2, lon2]) {
  const R = 6_371_000;
  const r = d => (d * Math.PI) / 180;
  const a =
    Math.sin(r(lat2 - lat1) / 2) ** 2 +
    Math.cos(r(lat1)) * Math.cos(r(lat2)) *
    Math.sin(r(lon2 - lon1) / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function buscarRota(from, to) {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${from[1]},${from[0]};${to[1]},${to[0]}` +
    `?overview=full&geometries=geojson&annotations=true`;
  const res  = await fetch(url, { signal: AbortSignal.timeout(12_000) });
  const data = await res.json();
  if (data.routes?.[0]) {
    return {
      coords:  data.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]),
      duracao: data.routes[0].duration,   
      distancia: data.routes[0].distance, 
    };
  }
  return null;
}

function AjustarCamera({ userLoc, truckPos }) {
  const map    = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(t);
  }, [map]);

  useEffect(() => {
    if (!userLoc || !truckPos) return;
    if (!fitted.current) {
      map.fitBounds(L.latLngBounds([userLoc, truckPos]), {
        padding: [70, 70], animate: true,
      });
      fitted.current = true;
    } else {
      map.panTo(truckPos, { animate: true, duration: 0.6 });
    }
  }, [truckPos, userLoc, map]);

  return null;
}

const MapaRastreio = ({ coletaId, status, onDurationFetched, onProgress, onChegou }) => {
  const [userLoc,      setUserLoc]     = useState(null);
  const [truckPos,     setTruckPos]    = useState(ECO_LOC);
  const [routeCoords, setRouteCoords] = useState([]);
  const [backendVivo, setBackendVivo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [simAtiva,    setSimAtiva]    = useState(false);
  const [simLoading,  setSimLoading]  = useState(false);

  const onDurationRef  = useRef(onDurationFetched);
  const onProgressRef  = useRef(onProgress);
  const onChegouRef    = useRef(onChegou);
  const duracaoInicRef = useRef(null);
  const distInicRef    = useRef(null);
  const userLocRef     = useRef(null);
  const truckPosRef    = useRef(ECO_LOC);
  const chegouRef      = useRef(false);
  const simIntervalRef = useRef(null);
  const rotaSimRef     = useRef([]);
  const mapWrapperRef  = useRef(null);

  // ── ALTERADO: Ref para guardar a instância ativa do STOMP ───────────────
  const stompClientRef = useRef(null);

  useEffect(() => { onDurationRef.current  = onDurationFetched; }, [onDurationFetched]);
  useEffect(() => { onProgressRef.current  = onProgress; },       [onProgress]);
  useEffect(() => { onChegouRef.current    = onChegou; },         [onChegou]);

  const isPendente = status === "PENDENTE" || status === "Pendente";

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapWrapperRef.current?.requestFullscreen().catch(err => {
        console.warn(`Erro ao tentar tela cheia: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const atualizarTruck = useCallback(async (novaPosicao, isSimulacao = false) => {
    if (chegouRef.current) return;

    truckPosRef.current = novaPosicao;
    setTruckPos([...novaPosicao]);

    if (!userLocRef.current) return;

    const distAtual = haversine(novaPosicao, userLocRef.current);

    if (distAtual <= ARRIVAL_M) {
      chegouRef.current = true;
      onChegouRef.current?.();
      if (isSimulacao) {
        clearInterval(simIntervalRef.current);
        setSimAtiva(false);
      }
      onProgressRef.current?.(0, 0);
      return;
    }

    try {
      const resultado = await buscarRota(novaPosicao, userLocRef.current);
      if (resultado) {
        setRouteCoords(resultado.coords);
        onProgressRef.current?.(resultado.duracao, resultado.distancia);
      }
    } catch (e) { }
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const pos = [coords.latitude, coords.longitude];
        setUserLoc(pos);
        userLocRef.current = pos;

        try {
          const resultado = await buscarRota(ECO_LOC, pos);
          if (resultado) {
            setRouteCoords(resultado.coords);
            rotaSimRef.current     = resultado.coords;
            duracaoInicRef.current = resultado.duracao;
            distInicRef.current    = resultado.distancia;
            onDurationRef.current?.(resultado.duracao, resultado.distancia);
            onProgressRef.current?.(resultado.duracao, resultado.distancia);
          }
        } catch (e) {
          console.warn("[MapaRastreio] Rota inicial:", e.message);
        }
      },
      (err) => {
        console.error("GPS:", err);
        alert("Ative a localização no navegador para usar o rastreio.");
      },
      { enableHighAccuracy: true, timeout: 20_000, maximumAge: 0 }
    );
  }, []);

  // ── ALTERADO: Conexão WebSocket no lugar do Polling Antigo ───────────────
  useEffect(() => {
    if (isPendente || !coletaId || simAtiva) return;

    const socket = new SockJS(`${API_BASE}/ws`);
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {}; // Desativa logs repetitivos de frame no console

    stompClient.connect({}, () => {
      stompClientRef.current = stompClient;
      setBackendVivo(true);

      // Ouvinte em tempo real da rota específica dessa coleta
      stompClient.subscribe(`/topic/rastreio/${coletaId}`, (msg) => {
        const data = JSON.parse(msg.body);
        if (data?.lat && data?.lng) {
          const novaPosicao = [data.lat, data.lng];
          // Evita processar micro-movimentos falsos menores que 2 metros
          if (haversine(truckPosRef.current, novaPosicao) > 2) {
            atualizarTruck(novaPosicao, false);
          }
        }
      });
    });

    return () => {
      if (stompClientRef.current) stompClientRef.current.disconnect();
    };
  }, [coletaId, isPendente, simAtiva, atualizarTruck]);

  // ── Simulação ─────────────────────────────────────────────────────────────
  const iniciarSimulacao = async () => {
    if (simAtiva || chegouRef.current) return;

    setSimLoading(true);
    setSimAtiva(true);

    let rota = rotaSimRef.current;
    if (userLocRef.current) {
      try {
        const resultado = await buscarRota(truckPosRef.current, userLocRef.current);
        if (resultado) {
          rota = resultado.coords;
          rotaSimRef.current = rota;
        }
      } catch (e) {
        console.warn("[Simulação] Rota:", e.message);
      }
    }

    setSimLoading(false);

    if (rota.length < 2) {
      setSimAtiva(false);
      return;
    }

    setRouteCoords(rota);
    let step = 0;
    const total = rota.length;
    const DURACAO_SIM_MS = 40_000;
    const INTERVALO      = Math.max(60, Math.round(DURACAO_SIM_MS / total));
    const INCREMENTO     = Math.max(1, Math.round(total / (DURACAO_SIM_MS / INTERVALO)));

    simIntervalRef.current = setInterval(async () => {
      step += INCREMENTO;
      if (step >= total) step = total - 1;

      const pos = rota[step];
      await atualizarTruck(pos, true);

      // ALTERADO: Transmite os passos da simulação para a rede.
      // Assim, se você abrir duas telas, uma tela controla a simulação e a outra se move sozinha!
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.send(
          `/app/rastreio/${coletaId}/atualizar`,
          {},
          JSON.stringify({ lat: pos[0], lng: pos[1] })
        );
      }

      if (step >= total - 1 || chegouRef.current) {
        clearInterval(simIntervalRef.current);
        setSimAtiva(false);
      }
    }, INTERVALO);
  };

  const pararSimulacao = () => {
    clearInterval(simIntervalRef.current);
    setSimAtiva(false);
    truckPosRef.current = ECO_LOC;
    setTruckPos(ECO_LOC);
    chegouRef.current = false;
  };

  useEffect(() => () => {
    clearInterval(simIntervalRef.current);
  }, []);

  return (
    <div className="mapar-wrapper" ref={mapWrapperRef}>
      <MapContainer
        center={ECO_LOC}
        zoom={13}
        style={{ height: "100%", width: "100%", borderRadius: "16px" }}
        zoomControl
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AjustarCamera userLoc={userLoc} truckPos={truckPos} />

        {routeCoords.length > 1 && (
          <Polyline positions={routeCoords} color="#4a90e2" weight={5} opacity={0.82} />
        )}

        {userLoc && (
          <Marker position={userLoc} icon={clienteIcon}>
            <Popup>📍 Seu endereço</Popup>
          </Marker>
        )}

        <Marker position={truckPos} icon={truckIcon}>
          <Popup>
            Work 🚛 {backendVivo
              ? "Posição em tempo real"
              : simAtiva
              ? "Simulação em andamento"
              : "Aguardando coletor…"}
          </Popup>
        </Marker>
      </MapContainer>

      <div className={`mapar-badge ${simAtiva ? "mapar-badge--sim" : ""}`}>
        <span className="mapar-badge-dot" />
        {simAtiva
          ? simLoading ? "Calculando rota…" : "🎮 Simulação ativa"
          : backendVivo
          ? "🔴 Ao vivo"
          : "Aguardando coletor…"}
      </div>

      <button 
        className="mapar-fullscreen-btn" 
        onClick={toggleFullscreen}
        title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
      >
        {isFullscreen ? "↙️" : "↗️"}
      </button>

      {!chegouRef.current && (
        <div className="mapar-sim-bar">
          {simAtiva ? (
            <button className="mapar-sim-btn mapar-sim-btn--stop" onClick={pararSimulacao}>
              {simLoading
                ? <><span className="mapar-spinner-sm" /> Calculando…</>
                : "■ Parar simulação"}
            </button>
          ) : (
            <button className="mapar-sim-btn" onClick={iniciarSimulacao}>
              ▶ Simular chegada
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MapaRastreio;