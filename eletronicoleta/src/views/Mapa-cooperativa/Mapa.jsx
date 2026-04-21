import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import 'leaflet/dist/leaflet.css'; // CSS OBRIGATÓRIO DO MAPA
import { IconTruck, IconBin } from "./MapaIcones";

// 1. COMPONENTE DE GPS (Localização do Usuário)
function LocationMarker() {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    // Pede permissão ao navegador e voa para a localização
    map.locate({ setView: true, maxZoom: 13 });
    
    map.on('locationfound', (e) => {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Você está aqui</Popup>
    </Marker>
  );
}

// Função para transformar seus ícones React em marcadores do Leaflet
const getCustomIcon = (tipo, isSelected) => {
  const iconComponent = tipo === "coleta" ? <IconTruck /> : <IconBin />;
  // Converte o componente React para HTML puro para o mapa entender
  const iconMarkup = ReactDOMServer.renderToStaticMarkup(iconComponent);

  return L.divIcon({
    html: `<div class="map-pin ${tipo} ${isSelected ? 'selected' : ''}" style="position: relative; transform: none; left: 0; top: 0;">${iconMarkup}</div>`,
    className: 'custom-leaflet-marker', 
    iconSize: [34, 34], 
    iconAnchor: [17, 17], 
    popupAnchor: [0, -17] // Ajuste para o balão abrir acima do ícone
  });
};

const MapaMundi = ({ items, selected, onSelect }) => {
  // Posição inicial (Centro do Brasil) caso o usuário negue o GPS
  const posInicial = [-15.7801, -47.9292]; 
  const zoomInicial = 4;

  return (
    <div className="mapa-card mapa-map-card">
      <div className="mapa-map-area" style={{ height: '400px', width: '100%', zIndex: 1 }}>
        
        <MapContainer 
          center={posInicial} 
          zoom={zoomInicial} 
          style={{ height: '100%', width: '100%', borderRadius: '10px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Chama o componente do GPS */}
          <LocationMarker />

          {/* Renderizando os itens */}
          {items.map(item => {
            const isSelected = selected?.id === item.id;
            
            return (
              <Marker
                key={item.id}
                position={[item.lat, item.lng]}
                icon={getCustomIcon(item.tipo, isSelected)}
                eventHandlers={{
                  click: () => onSelect(item), // Atualiza os detalhes laterais
                }}
              >
                {/* 2. BALÃO DE DESCRIÇÃO AO CLICAR NO ÍCONE */}
                <Popup>
                  <div style={{ textAlign: 'center', fontSize: '13px' }}>
                    <strong style={{ fontSize: '14px', color: '#1e4d1e' }}>{item.label}</strong><br />
                    {item.tipo === "coleta" 
                      ? `Motorista: ${item.motorista}` 
                      : `Ocupação: ${item.ocupacao}`}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

      </div>
    </div>
  );
};

export default MapaMundi;