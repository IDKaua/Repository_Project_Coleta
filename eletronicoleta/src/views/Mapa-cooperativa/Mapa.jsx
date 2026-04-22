import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import 'leaflet/dist/leaflet.css';
import { IconTruck, IconBin } from "./Mapaicones";

function LocationMarker() {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 14 });
    map.on('locationfound', (e) => {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Sua Localização</Popup>
    </Marker>
  );
}

const getCustomIcon = (tipo, isSelected) => {
  const iconComponent = tipo === "coleta" ? <IconTruck /> : <IconBin />;
  const iconMarkup = ReactDOMServer.renderToStaticMarkup(iconComponent);

  return L.divIcon({
    html: `<div class="map-pin ${tipo} ${isSelected ? 'selected' : ''}">${iconMarkup}</div>`,
    className: 'custom-leaflet-marker',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17]
  });
};

const MapaMundi = ({ items, selected, onSelect }) => {
  // POSIÇÃO INICIAL EM MACEIÓ
  const posInicial = [-9.6658, -35.7350];
  const zoomInicial = 13; // Zoom ideal para ver os bairros e pontos

  return (
    <div className="mapa-card mapa-map-card">
      <div className="mapa-map-area" style={{ height: '450px', width: '100%', zIndex: 1 }}>
        <MapContainer
          center={posInicial}
          zoom={zoomInicial}
          style={{ height: '100%', width: '100%', borderRadius: '10px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
          
          {items.map(item => {
            const isSelected = selected?.id === item.id;
            return (
              <Marker
                key={item.id}
                position={[item.lat, item.lng]}
                icon={getCustomIcon(item.tipo, isSelected)}
                eventHandlers={{
                  click: () => onSelect(item),
                }}
              >
                <Popup>
                  <div style={{ textAlign: 'center', fontSize: '13px' }}>
                    <strong style={{ fontSize: '14px', color: '#1e4d1e' }}>
                      {item.label}
                    </strong><br />
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