import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapCard.css';

// Ícone do Cliente (Vitória Almeida)
const customerIcon = L.divIcon({
  html: `<div style="background: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
  className: 'custom-pin',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

// Ícone do Caminhão
const truckIcon = L.divIcon({
  html: `<div style="color: #2d8659; font-size: 20px; background: white; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid #2d8659; box-shadow: 0 4px 6px rgba(0,0,0,0.2);"><i class="fas fa-truck"></i></div>`,
  className: 'custom-pin',
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

// Ajusta a câmera do mapa
const AjustarCamera = ({ truckLoc, clientLoc }) => {
  const map = useMap();
  useEffect(() => {
    if (truckLoc && clientLoc) {
      const bounds = L.latLngBounds([truckLoc, clientLoc]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [truckLoc, clientLoc, map]);
  return null;
};

function MapCard() {
  const [routeCoords, setRouteCoords] = useState([]);
  const [truckLoc, setTruckLoc] = useState(null);

  // Coordenadas em Maceió
  const clientLoc = [-9.6650, -35.7350]; 
  const startLoc = [-9.6540, -35.7315];  

  useEffect(() => {
    fetch(`https://router.project-osrm.org/route/v1/driving/${startLoc[1]},${startLoc[0]};${clientLoc[1]},${clientLoc[0]}?overview=full&geometries=geojson`)
      .then(res => res.json())
      .then(data => {
        if (data.routes && data.routes.length > 0) {
          const coordsDaRua = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          setRouteCoords(coordsDaRua);
          setTruckLoc(coordsDaRua[0]);
        }
      });
  }, []);

  useEffect(() => {
    if (routeCoords.length > 0) {
      let passoAtual = 0;
      const animacao = setInterval(() => {
        if (passoAtual < routeCoords.length) {
          setTruckLoc(routeCoords[passoAtual]);
          passoAtual += 2;
        } else {
          clearInterval(animacao);
        }
      }, 300);
      return () => clearInterval(animacao);
    }
  }, [routeCoords]);

  return (
    <div className="map-card" style={{ height: '550px', width: '100%', position: 'relative', overflow: 'hidden', zIndex: 1 }}>
      <MapContainer center={startLoc} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        <AjustarCamera truckLoc={truckLoc} clientLoc={clientLoc} />

        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="#4a90e2" weight={5} opacity={0.8} dashArray="10, 10" />
        )}

        <Marker position={clientLoc} icon={customerIcon}>
          <Popup>
            <strong>Vitória Almeida</strong><br/>
            Av. Principal, 123
          </Popup>
        </Marker>

        {truckLoc && (
          <Marker position={truckLoc} icon={truckIcon}>
            <Popup>Seu veículo</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default MapCard;