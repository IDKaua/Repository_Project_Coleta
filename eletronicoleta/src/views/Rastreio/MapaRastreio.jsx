import React, { useState, useEffect, useRef } from "react";
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

// ── Corrige ícones padrão do Leaflet ─────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const API_BASE         = "http://localhost:8080";
const POLL_INTERVAL_MS = 4000;

// Posição de fallback do coletor (cooperativa) — usada enquanto backend não responde
const ECO_LOC = [-9.654, -35.7315];

// ── Ícone caminhão ────────────────────────────────────────────────────────
const truckIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:44px;height:44px;
    background:#4a90e2;
    border-radius:50%;
    border:3px solid #fff;
    box-shadow:0 3px 14px rgba(74,144,226,0.55);
    display:flex;align-items:center;justify-content:center;
    font-size:20px;
  ">🚛</div>`,
  iconSize:   [44, 44],
  iconAnchor: [22, 22],
  popupAnchor:[0, -24],
});

// ── Ícone cliente ─────────────────────────────────────────────────────────
const clienteIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:44px;height:44px;
    background:#2d8659;
    border-radius:50%;
    border:3px solid #fff;
    box-shadow:0 3px 14px rgba(45,134,89,0.55);
    display:flex;align-items:center;justify-content:center;
    font-size:17px;font-weight:800;color:#fff;
    font-family:'Segoe UI',sans-serif;
  ">EU</div>`,
  iconSize:   [44, 44],
  iconAnchor: [22, 44],
  popupAnchor:[0, -46],
});

// ── Haversine ─────────────────────────────────────────────────────────────
function haversine([lat1, lon1], [lat2, lon2]) {
  const R = 6_371_000;
  const r = d => (d * Math.PI) / 180;
  const a =
    Math.sin(r(lat2 - lat1) / 2) ** 2 +
    Math.cos(r(lat1)) * Math.cos(r(lat2)) *
    Math.sin(r(lon2 - lon1) / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Busca rota OSRM entre dois pontos ─────────────────────────────────────
async function buscarRota(from, to) {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${from[1]},${from[0]};${to[1]},${to[0]}` +
    `?overview=full&geometries=geojson`;
  const res  = await fetch(url, { signal: AbortSignal.timeout(12_000) });
  const data = await res.json();
  if (data.routes?.[0]) {
    return {
      coords:   data.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]),
      duracao:  data.routes[0].duration, // segundos
    };
  }
  return null;
}

// ── Câmera: enquadra os dois pontos e segue o caminhão ───────────────────
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
        padding: [70, 70],
        animate: true,
      });
      fitted.current = true;
    } else {
      map.panTo(truckPos, { animate: true, duration: 0.6 });
    }
  }, [truckPos, userLoc, map]);

  return null;
}

// ─────────────────────────────────────────────────────────────────────────
const MapaRastreio = ({ coletaId, status, onDurationFetched, onProgress }) => {
  const [userLoc,     setUserLoc]     = useState(null);
  const [truckPos,    setTruckPos]    = useState(ECO_LOC); // começa na cooperativa
  const [routeCoords, setRouteCoords] = useState([]);
  const [backendVivo, setBackendVivo] = useState(false);

  const onDurationRef   = useRef(onDurationFetched);
  const onProgressRef   = useRef(onProgress);
  const duracaoInicRef  = useRef(null);
  const userLocRef      = useRef(null);
  const truckPosRef     = useRef(ECO_LOC);

  useEffect(() => { onDurationRef.current = onDurationFetched; }, [onDurationFetched]);
  useEffect(() => { onProgressRef.current = onProgress; },       [onProgress]);

  const isPendente = status === "PENDENTE" || status === "Pendente";

  // ── Pega GPS do cliente e traça rota inicial imediatamente ───────────────
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const pos = [coords.latitude, coords.longitude];
        setUserLoc(pos);
        userLocRef.current = pos;

        // Traça rota da cooperativa → cliente logo que o GPS responder
        try {
          const resultado = await buscarRota(truckPosRef.current, pos);
          if (resultado) {
            setRouteCoords(resultado.coords);
            duracaoInicRef.current = resultado.duracao;
            onDurationRef.current?.(resultado.duracao);
            onProgressRef.current?.(resultado.duracao, resultado.duracao);
          }
        } catch (e) {
          console.warn("[MapaRastreio] Rota inicial:", e.message);
        }
      },
      (err) => {
        console.error("GPS cliente:", err);
        alert("Ative a localização no navegador para usar o rastreio.");
      },
      { enableHighAccuracy: true, timeout: 20_000, maximumAge: 0 }
    );
  }, []);

  // ── Polling: busca posição real do coletor no backend ────────────────────
  useEffect(() => {
    if (isPendente || !coletaId) return;

    const poll = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/coletas/${coletaId}/localizacao`,
          { signal: AbortSignal.timeout(5_000) }
        );
        if (!res.ok) return;

        const data = await res.json(); // { lat, lng }
        if (!data?.lat || !data?.lng) return;

        const novaPosicao = [data.lat, data.lng];

        // Só atualiza se o coletor realmente se moveu (>5m)
        const moveu = haversine(truckPosRef.current, novaPosicao) > 5;
        if (!moveu) return;

        truckPosRef.current = novaPosicao;
        setTruckPos(novaPosicao);
        setBackendVivo(true);

        // Recalcula rota da nova posição do coletor até o cliente
        if (userLocRef.current) {
          try {
            const resultado = await buscarRota(novaPosicao, userLocRef.current);
            if (resultado) {
              setRouteCoords(resultado.coords);

              // Atualiza tempo restante
              onProgressRef.current?.(
                resultado.duracao,
                duracaoInicRef.current ?? resultado.duracao
              );
            }
          } catch (e) {
            console.warn("[MapaRastreio] Rota atualizada:", e.message);
          }
        }
      } catch (e) {
        // backend ainda não implementou o endpoint — rota inicial já está visível
        console.warn("[MapaRastreio] Polling:", e.message);
      }
    };

    poll(); // primeira chamada imediata
    const intervalo = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(intervalo);
  }, [coletaId, isPendente]);

  return (
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

      {/* Rota azul do coletor até o cliente */}
      {routeCoords.length > 1 && (
        <Polyline
          positions={routeCoords}
          color="#4a90e2"
          weight={5}
          opacity={0.8}
        />
      )}

      {/* Marcador do cliente */}
      {userLoc && (
        <Marker position={userLoc} icon={clienteIcon}>
          <Popup>📍 Seu endereço</Popup>
        </Marker>
      )}

      {/* Marcador do coletor */}
      <Marker position={truckPos} icon={truckIcon}>
        <Popup>
          🚛 {backendVivo ? "Posição em tempo real" : "Aguardando localização do coletor…"}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapaRastreio;