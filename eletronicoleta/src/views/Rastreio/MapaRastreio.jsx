import React, { useState, useEffect } from "react";
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

const userIcon = L.divIcon({
  html: `
    <div class="rastreio-pin user-pin">
      <div class="pin-dot red-dot"></div>
    </div>
  `,
  className: "custom-pin",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const ecoIcon = L.divIcon({
  html: `
    <div class="rastreio-pin eco-pin">
      <i class="fas fa-building"></i>
    </div>
  `,
  className: "custom-pin",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const truckIcon = L.divIcon({
  html: `
    <div class="rastreio-pin truck-pin">
      <i class="fas fa-truck"></i>
    </div>
  `,
  className: "custom-pin",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const AjustarCamera = ({ userLoc, ecoLoc }) => {
  const map = useMap();

  useEffect(() => {
    if (userLoc && ecoLoc) {
      const bounds = L.latLngBounds([userLoc, ecoLoc]);

      map.fitBounds(bounds, {
        padding: [50, 50],
      });
    }
  }, [userLoc, ecoLoc, map]);

  return null;
};

const MapaRastreio = ({ status }) => {
  const [userLoc, setUserLoc] = useState(null);
  const [truckLoc, setTruckLoc] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);

  const isPendente =
    status === "PENDENTE" || status === "Pendente";

  const ecoLoc = [-9.654, -35.7315];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const userPos = [latitude, longitude];

        setUserLoc(userPos);

        if (isPendente) {
          setRouteCoords([]);
          setTruckLoc(null);
          return;
        }

        fetch(
          `https://router.project-osrm.org/route/v1/driving/${ecoLoc[1]},${ecoLoc[0]};${longitude},${latitude}?overview=full&geometries=geojson`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.routes && data.routes.length > 0) {
              const coordsDaRua =
                data.routes[0].geometry.coordinates.map((c) => [
                  c[1],
                  c[0],
                ]);

              setRouteCoords(coordsDaRua);
              setTruckLoc(coordsDaRua[0]);
            }
          })
          .catch((error) => {
            console.error("Erro ao buscar rota:", error);
          });
      },
      (err) => {
        console.error("Erro ao acessar o GPS:", err);
        alert(
          "Ative a localização no seu navegador para simular a rota!"
        );
      }
    );
  }, [isPendente]);

  useEffect(() => {
    if (routeCoords.length === 0) return;

    let passoAtual = 0;

    const animacao = setInterval(() => {
      if (passoAtual < routeCoords.length) {
        setTruckLoc(routeCoords[passoAtual]);
        passoAtual += 3;
      } else {
        clearInterval(animacao);
      }
    }, 300);

    return () => clearInterval(animacao);
  }, [routeCoords]);

  return (
    <MapContainer
      center={ecoLoc}
      zoom={13}
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "20px",
      }}
      zoomControl={false}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <AjustarCamera userLoc={userLoc} ecoLoc={ecoLoc} />

      {routeCoords.length > 0 && (
        <Polyline
          positions={routeCoords}
          color="#3b82f6"
          weight={5}
          opacity={0.7}
        />
      )}

      {userLoc && (
        <Marker position={userLoc} icon={userIcon}>
          <Popup>Sua Localização</Popup>
        </Marker>
      )}

      {truckLoc && (
        <Marker position={truckLoc} icon={truckIcon}>
          <Popup>Caminhão em Rota</Popup>
        </Marker>
      )}

      <Marker position={ecoLoc} icon={ecoIcon}>
        <Popup>Central EcoTech</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapaRastreio;