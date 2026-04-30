import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import 'leaflet/dist/leaflet.css';

// Ícones personalizados (Mantidos iguais ao seu CSS)
const userIcon = L.divIcon({
  html: `<div class="rastreio-pin user-pin"><div class="pin-dot red-dot"></div></div>`,
  className: 'custom-pin',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const ecoIcon = L.divIcon({
  html: `<div class="rastreio-pin eco-pin"><i class="fas fa-building"></i></div>`,
  className: 'custom-pin',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const truckIcon = L.divIcon({
  html: `<div class="rastreio-pin truck-pin"><i class="fas fa-truck"></i></div>`,
  className: 'custom-pin',
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

// Componente para ajustar a câmera do mapa para focar na rota
const AjustarCamera = ({ userLoc, ecoLoc }) => {
  const map = useMap();
  useEffect(() => {
    if (userLoc && ecoLoc) {
      // Cria um "quadro" que engloba o usuário e a central e ajusta o zoom
      const bounds = L.latLngBounds([userLoc, ecoLoc]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [userLoc, ecoLoc, map]);
  return null;
};

const MapaRastreio = () => {
  const [userLoc, setUserLoc] = useState(null); // Localização real do usuário
  const [truckLoc, setTruckLoc] = useState(null); // Localização do caminhão animado
  const [routeCoords, setRouteCoords] = useState([]); // Coordenadas das ruas

  // Sede da EcoTech (Fixa no Farol, Maceió)
  const ecoLoc = [-9.6540, -35.7315];

  useEffect(() => {
    // 1. Pegar a localização real do usuário (GPS)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const userPos = [latitude, longitude];
        setUserLoc(userPos);

        // 2. Buscar a rota traçada pelas ruas (OSRM API Pública)
        // O caminhão sai da EcoTech e vai até o Usuário
        fetch(`https://router.project-osrm.org/route/v1/driving/${ecoLoc[1]},${ecoLoc[0]};${longitude},${latitude}?overview=full&geometries=geojson`)
          .then(res => res.json())
          .then(data => {
            if (data.routes && data.routes.length > 0) {
              // A API retorna [longitude, latitude], o Leaflet usa [latitude, longitude]
              const coordsDaRua = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
              setRouteCoords(coordsDaRua);
              setTruckLoc(coordsDaRua[0]); // Coloca o caminhão na largada
            }
          });
      },
      (err) => {
        console.error("Erro ao acessar o GPS:", err);
        alert("Ative a localização no seu navegador para simular a rota!");
      }
    );
  }, []); // Executa só uma vez ao carregar a tela

  // 3. Simulação de Movimento do Caminhão
  useEffect(() => {
    if (routeCoords.length > 0) {
      let passoAtual = 0;
      
      const animacao = setInterval(() => {
        if (passoAtual < routeCoords.length) {
          setTruckLoc(routeCoords[passoAtual]);
          passoAtual += 3; // Velocidade do caminhão (aumente para ir mais rápido)
        } else {
          clearInterval(animacao); // Para a animação quando chegar
        }
      }, 300); // Atualiza o caminhão a cada 300 milissegundos

      return () => clearInterval(animacao);
    }
  }, [routeCoords]);

  return (
    <MapContainer 
      center={ecoLoc} 
      zoom={13} 
      style={{ height: '100%', width: '100%', borderRadius: '20px' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <AjustarCamera userLoc={userLoc} ecoLoc={ecoLoc} />

      {/* Desenha a rota acompanhando as ruas exatas */}
      {routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="#3b82f6" weight={5} opacity={0.7} />
      )}

      {/* Pino da sua localização real */}
      {userLoc && (
        <Marker position={userLoc} icon={userIcon}>
          <Popup>Sua Localização</Popup>
        </Marker>
      )}

      {/* Pino do caminhão que se move */}
      {truckLoc && (
        <Marker position={truckLoc} icon={truckIcon}>
          <Popup>Caminhão em Rota</Popup>
        </Marker>
      )}

      {/* Pino da Cooperativa EcoTech */}
      <Marker position={ecoLoc} icon={ecoIcon}>
        <Popup>Central EcoTech</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapaRastreio;