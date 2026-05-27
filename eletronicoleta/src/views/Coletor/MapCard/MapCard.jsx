import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapCard.css";

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
  iconSize:   [48, 48],
  iconAnchor: [24, 24],
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
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson&annotations=true`;
    const res  = await fetch(url, { signal: AbortSignal.timeout(12_000) });
    const data = await res.json();
    if (data.routes?.[0]) {
      return data.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
    }
  } catch (e) {
    console.error("Erro OSRM:", e);
  }
  return [];
}

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 500);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

function AjustarCamera({ userLoc, truckPos }) {
  const map    = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (!userLoc || !truckPos) return;
    if (!fitted.current) {
      map.fitBounds(L.latLngBounds([userLoc, truckPos]), { padding: [50, 50], animate: true });
      fitted.current = true;
    } else {
      map.panTo(truckPos, { animate: true, duration: 0.6 });
    }
  }, [truckPos, userLoc, map]);

  return null;
}

const MapCard = ({ coleta, coletaId, onChegou, coletado }) => {
  const [destinoLoc, setDestinoLoc] = useState(() => {
    if (coleta?.latitude && coleta?.longitude) {
      return [coleta.latitude, coleta.longitude];
    }
    return null;
  }); 
  
  const [truckPos, setTruckPos] = useState(ECO_LOC);
  const [routeCoords, setRouteCoords] = useState([]);
  const [transmitindo, setTransmitindo] = useState(false);

  const truckPosRef          = useRef(ECO_LOC);
  const chegouRef            = useRef(false);
  const watchIdRef           = useRef(null); 
  const stompClientRef       = useRef(null);
  const onChegouRef          = useRef(onChegou);
  const destinoLocRef        = useRef(destinoLoc);
  const ultimaPosicaoRotaRef = useRef(null);
  const cronometroRef        = useRef(null); // Ref do temporizador de 1 segundo

  useEffect(() => { onChegouRef.current = onChegou; }, [onChegou]);
  useEffect(() => { destinoLocRef.current = destinoLoc; }, [destinoLoc]);

  useEffect(() => {
    if (coleta?.latitude && coleta?.longitude) {
      setDestinoLoc([coleta.latitude, coleta.longitude]);
    } else if (coleta && coleta.endereco) {
      const enderecoLimpo = coleta.endereco.split(" (Ref:")[0];
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(enderecoLimpo)}&format=json&limit=1`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setDestinoLoc([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          }
        })
        .catch(err => console.error("Erro geocoding:", err));
    }
  }, [coleta]);

  const atualizarTruck = useCallback(async (novaPosicao) => {
    if (chegouRef.current) return;
    truckPosRef.current = novaPosicao;
    setTruckPos([...novaPosicao]);

    const destinoAtual = destinoLocRef.current;
    if(!destinoAtual) return;

    const distAtual = haversine(novaPosicao, destinoAtual);

    if (distAtual <= ARRIVAL_M) {
      chegouRef.current = true;
      setRouteCoords([]);
      if (onChegouRef.current) onChegouRef.current();
      return;
    }

    // Sensibilidade alterada para 5 metros
    if (!ultimaPosicaoRotaRef.current || haversine(ultimaPosicaoRotaRef.current, novaPosicao) > 5) {
      ultimaPosicaoRotaRef.current = novaPosicao;
      setRouteCoords([]);
      try {
        const rota = await buscarRota(novaPosicao, destinoAtual);
        if (rota.length > 1) setRouteCoords(rota);
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    if (!coletaId) return;
    const socket = new SockJS(`${API_BASE}/ws`);
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {}; 

    stompClient.connect({}, () => {
      stompClientRef.current = stompClient;
    });

    return () => {
      if (stompClientRef.current) stompClientRef.current.disconnect();
    };
  }, [coletaId]);

  const iniciarRotaReal = () => {
    if (!('geolocation' in navigator)) {
      alert("Seu navegador não suporta GPS.");
      return;
    }
    if (!coletaId) {
      alert("Erro: ID da coleta não encontrado.");
      return;
    }

    setTransmitindo(true);
    let ultimaPosicaoConhecida = null;

    // Fica lendo o GPS silenciosamente
    watchIdRef.current = navigator.geolocation.watchPosition(
      (posicao) => {
        ultimaPosicaoConhecida = [posicao.coords.latitude, posicao.coords.longitude];
      },
      (erro) => console.error("Erro GPS:", erro),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    // Dispara a última posição lida exatamente a cada 1 segundo (1000 ms)
    cronometroRef.current = setInterval(async () => {
      if (ultimaPosicaoConhecida) {
        await atualizarTruck(ultimaPosicaoConhecida);

        if (stompClientRef.current && stompClientRef.current.connected) {
          stompClientRef.current.send(
            `/topic/rastreio/${coletaId}`,
            {},
            JSON.stringify({ lat: ultimaPosicaoConhecida[0], lng: ultimaPosicaoConhecida[1] })
          );
        }
      }
    }, 1000);
  };

  const pararRota = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (cronometroRef.current) {
      clearInterval(cronometroRef.current);
      cronometroRef.current = null;
    }
    setTransmitindo(false);
  };

  const handleFinalizar = async () => {
    if (!window.confirm("Confirmar que o material foi coletado com sucesso?")) return;

    try {
      const response = await fetch(`${API_BASE}/api/coletas/finalizar/${coletaId}`, {
        method: "PUT"
      });

      if (response.ok) {
        alert("✨ Coleta finalizada com sucesso!");
        pararRota(); 
        if (onChegouRef.current) onChegouRef.current(); 
      } else {
        alert("Erro ao finalizar a coleta no servidor.");
      }
    } catch (error) {
      alert("Erro de conexão ao tentar finalizar.");
    }
  };

  useEffect(() => () => {
    if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    if (cronometroRef.current) clearInterval(cronometroRef.current);
  }, []);

  return (
    <div style={{ height: "500px", width: "100%", borderRadius: "16px", overflow: "hidden", position: "relative", border: "2px solid #e2e8f0" }}>
      <MapContainer center={ECO_LOC} zoom={14} style={{ height: "100%", width: "100%" }} zoomControl scrollWheelZoom>
        <MapResizer />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <AjustarCamera userLoc={destinoLoc} truckPos={truckPos} />
        
        {routeCoords.length > 1 && !coletado && (
          <Polyline positions={routeCoords} color="#4a90e2" weight={5} opacity={0.8} />
        )}
        
        {destinoLoc && (
          <Marker position={destinoLoc} icon={coletaIcon}>
             <Popup>📦 Ponto de Coleta</Popup>
          </Marker>
        )}

        <Marker position={truckPos} icon={truckIcon}></Marker>
      </MapContainer>

      {!coletado && (
        <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 999, display: "flex", gap: "10px", width: "max-content" }}>
          {transmitindo ? (
            <>
              <button onClick={pararRota} style={{ padding: "12px 20px", backgroundColor: "#ef4444", color: "white", fontWeight: "bold", borderRadius: "8px", border: "none", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.2)" }}>
                ■ Parar
              </button>
              <button onClick={handleFinalizar} style={{ padding: "12px 20px", backgroundColor: "#3b82f6", color: "white", fontWeight: "bold", borderRadius: "8px", border: "none", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.2)" }}>
                ✅ Confirmar Coleta
              </button>
            </>
          ) : (
            <button onClick={iniciarRotaReal} style={{ padding: "12px 24px", backgroundColor: "#10b981", color: "white", fontWeight: "bold", borderRadius: "8px", border: "none", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.2)" }}>
              ▶ Iniciar Rota (GPS Real)
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MapCard;