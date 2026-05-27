import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapaRastreio.css";

// Conectores do WebSocket
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
  const a = Math.sin(r(lat2 - lat1) / 2) ** 2 + Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lon2 - lon1) / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function buscarRota(from, to) {
  const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson&annotations=true`;
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
    if (!userLoc || !truckPos) return;
    if (!fitted.current) {
      map.fitBounds(L.latLngBounds([userLoc, truckPos]), { padding: [70, 70], animate: true });
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

  const onDurationRef  = useRef(onDurationFetched);
  const onProgressRef  = useRef(onProgress);
  const onChegouRef    = useRef(onChegou);
  const userLocRef     = useRef(null);
  const truckPosRef    = useRef(ECO_LOC);
  const chegouRef      = useRef(false);
  const stompClientRef = useRef(null);

  useEffect(() => { onDurationRef.current  = onDurationFetched; }, [onDurationFetched]);
  useEffect(() => { onProgressRef.current  = onProgress; },       [onProgress]);
  useEffect(() => { onChegouRef.current    = onChegou; },         [onChegou]);

  const isPendente = status === "PENDENTE" || status === "Pendente";

  const atualizarTruck = useCallback(async (novaPosicao) => {
    if (chegouRef.current) return;
    truckPosRef.current = novaPosicao;
    setTruckPos([...novaPosicao]);

    if (!userLocRef.current) return;
    const distAtual = haversine(novaPosicao, userLocRef.current);

    if (distAtual <= ARRIVAL_M) {
      chegouRef.current = true;
      onChegouRef.current?.();
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
            onDurationRef.current?.(resultado.duracao, resultado.distancia);
          }
        } catch (e) { }
      },
      (err) => console.error("GPS Morador:", err),
      { enableHighAccuracy: true, timeout: 20_000, maximumAge: 0 }
    );
  }, []);

  // Conexão WebSocket para OUVIR o caminhão (Morador é espectador)
  useEffect(() => {
    if (isPendente || !coletaId) return;

    const socket = new SockJS(`${API_BASE}/ws`);
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {}; 

    stompClient.connect({}, () => {
      stompClientRef.current = stompClient;
      setBackendVivo(true);

      // Ouvindo a rota da coleta
      stompClient.subscribe(`/topic/rastreio/${coletaId}`, (msg) => {
        const data = JSON.parse(msg.body);
        if (data?.lat && data?.lng) {
          const novaPosicao = [data.lat, data.lng];
          if (haversine(truckPosRef.current, novaPosicao) > 2) {
            atualizarTruck(novaPosicao);
          }
        }
      });
    });

    return () => {
      if (stompClientRef.current) stompClientRef.current.disconnect();
    };
  }, [coletaId, isPendente, atualizarTruck]);

  return (
    <div className="mapar-wrapper">
      <MapContainer center={ECO_LOC} zoom={13} style={{ height: "100%", width: "100%", borderRadius: "16px" }} zoomControl scrollWheelZoom>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <AjustarCamera userLoc={userLoc} truckPos={truckPos} />
        {routeCoords.length > 1 && <Polyline positions={routeCoords} color="#4a90e2" weight={5} opacity={0.82} />}
        {userLoc && <Marker position={userLoc} icon={clienteIcon}><Popup>📍 Local de Coleta</Popup></Marker>}
        <Marker position={truckPos} icon={truckIcon}><Popup>🚛 Caminhão EcoTech</Popup></Marker>
      </MapContainer>

      {/* Badge simplificado para o morador */}
      <div className={`mapar-badge`}>
        <span className="mapar-badge-dot" />
        {backendVivo ? "🔴 Ao vivo" : "Aguardando partida..."}
      </div>

      {/* BOTÕES DE CONTROLE REMOVIDOS DAQUI */}
    </div>
  );
};

export default MapaRastreio;