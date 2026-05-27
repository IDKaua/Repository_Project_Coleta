import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapaRastreio.css";

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

const coletaIcon = L.divIcon({
  className: "",
  html: `<div class="mapa-icon mapa-icon--coleta" style="background:#27ae60; color:white; border-radius:50%; width:44px; height:44px; display:flex; align-items:center; justify-content:center; font-size:20px; box-shadow:0 4px 10px rgba(0,0,0,0.3); border:2px solid white;">📦</div>`,
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

function AjustarCamera({ destino, truckPos }) {
  const map    = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (!destino || !truckPos) return;
    if (!fitted.current) {
      map.fitBounds(L.latLngBounds([destino, truckPos]), { padding: [70, 70], animate: true });
      fitted.current = true;
    } else {
      map.panTo(truckPos, { animate: true, duration: 0.6 });
    }
  }, [truckPos, destino, map]);

  return null;
}

const MapaRastreio = ({ coletaId, status, coletaCoords, onDurationFetched, onProgress, onChegou }) => {
  const [truckPos,     setTruckPos]    = useState(ECO_LOC); 
  const [routeCoords, setRouteCoords] = useState([]);
  const [backendVivo, setBackendVivo] = useState(false);

  const destinoOficialRef = useRef(null);
  const ultimaPosicaoRotaRef = useRef(null);
  const onDurationRef  = useRef(onDurationFetched);
  const onProgressRef  = useRef(onProgress);
  const onChegouRef    = useRef(onChegou);
  const truckPosRef    = useRef(ECO_LOC);
  const chegouRef      = useRef(false);
  const stompClientRef = useRef(null);

  useEffect(() => { destinoOficialRef.current = coletaCoords; }, [coletaCoords]);
  useEffect(() => { onDurationRef.current  = onDurationFetched; }, [onDurationFetched]);
  useEffect(() => { onProgressRef.current  = onProgress; },        [onProgress]);
  useEffect(() => { onChegouRef.current    = onChegou; },          [onChegou]);

  const isPendente = status === "PENDENTE" || status === "Pendente";

  const atualizarTruck = useCallback(async (novaPosicao) => {
    if (chegouRef.current) return;
    
    truckPosRef.current = novaPosicao;
    setTruckPos([...novaPosicao]);

    const destino = destinoOficialRef.current;
    if (!destino) return;

    const distAtual = haversine(novaPosicao, destino);

    if (distAtual <= ARRIVAL_M) {
      chegouRef.current = true;
      setRouteCoords([]); 
      onChegouRef.current?.();
      onProgressRef.current?.(0, 0);
      return;
    }

    // Sensibilidade alterada para 5 metros
    if (!ultimaPosicaoRotaRef.current || haversine(ultimaPosicaoRotaRef.current, novaPosicao) > 5) {
      ultimaPosicaoRotaRef.current = novaPosicao;
      setRouteCoords([]); 
      
      try {
        const resultado = await buscarRota(novaPosicao, destino);
        if (resultado) {
          setRouteCoords(resultado.coords); 
          onProgressRef.current?.(resultado.duracao, resultado.distancia);
        }
      } catch (e) { 
        console.warn("Rota indisponível.");
      }
    }
  }, []);

  useEffect(() => {
    if (isPendente || !coletaCoords) return;
    buscarRota(ECO_LOC, coletaCoords).then(resultado => {
      if(resultado) {
        setRouteCoords(resultado.coords);
        onDurationRef.current?.(resultado.duracao, resultado.distancia);
      }
    });
  }, [isPendente, coletaCoords]);

  useEffect(() => {
    if (isPendente || !coletaId) return;

    const socket = new SockJS(`${API_BASE}/ws`);
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {}; 

    stompClient.connect({}, () => {
      stompClientRef.current = stompClient;
      setBackendVivo(true);

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
        <AjustarCamera destino={coletaCoords} truckPos={truckPos} />
        
        {!isPendente && routeCoords.length > 1 && (
          <Polyline positions={routeCoords} color="#4a90e2" weight={5} opacity={0.82} />
        )}

        {coletaCoords && (
          <Marker position={coletaCoords} icon={coletaIcon}>
            <Popup>📦 Ponto de Coleta</Popup>
          </Marker>
        )}
        
        {!isPendente && (
          <Marker position={truckPos} icon={truckIcon}>
            <Popup>🚛 Caminhão EcoTech</Popup>
          </Marker>
        )}
      </MapContainer>

      <div className={`mapar-badge`}>
        <span className="mapar-badge-dot" />
        {isPendente ? "Aguardando coletor..." : (backendVivo ? "🔴 Ao vivo" : "Aguardando partida...")}
      </div>
    </div>
  );
};

export default MapaRastreio;