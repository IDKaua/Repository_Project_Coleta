import React, { useEffect, useState, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapCard.css';

// ─── Corrige ícones padrão do Leaflet ──────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ─── Ícone caminhão (motorista) ─────────────────────────────────────────────
const truckIcon = L.divIcon({
  className: '',
  html: `<div class="map-icon map-icon--truck">🚛</div>`,
  iconSize:   [48, 48],
  iconAnchor: [24, 24],
  popupAnchor:[0, -26],
});

// ─── Ícone avatar (cliente) ─────────────────────────────────────────────────
const clientIcon = L.divIcon({
  className: '',
  html: `
    <div class="map-icon map-icon--client">
      <span class="map-icon-initials">VA</span>
      <div class="map-icon-pin"></div>
    </div>`,
  iconSize:   [50, 62],
  iconAnchor: [25, 62],
  popupAnchor:[0, -64],
});

// ─── Coordenadas de Maceió ──────────────────────────────────────────────────
// Cliente: Pajuçara, Maceió
const CLIENT_POS       = [-9.6658, -35.7350];
// Ponto de partida da simulação: Ponta Verde, Maceió (~3 km do cliente)
const DRIVER_SIM_START = [-9.6410, -35.7120];

// ─── Constantes ─────────────────────────────────────────────────────────────
const ARRIVAL_RADIUS_M = 50;   // metros para considerar "chegou"
const REROUTE_MIN_M    = 20;   // metros mínimos de deslocamento para rebuscar rota
const SIM_STEP_MS      = 110;  // intervalo entre passos da simulação (ms)

// ─── Distância geográfica (Haversine) ───────────────────────────────────────
function haversine([lat1, lon1], [lat2, lon2]) {
  const R    = 6_371_000;
  const toRad = d => (d * Math.PI) / 180;
  const dLat  = toRad(lat2 - lat1);
  const dLon  = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Busca rota via OSRM (gratuito, sem API key) ────────────────────────────
async function fetchRoute(from, to) {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${from[1]},${from[0]};${to[1]},${to[0]}` +
    `?overview=full&geometries=geojson`;
  const res  = await fetch(url, { signal: AbortSignal.timeout(12_000) });
  const data = await res.json();
  if (data.routes?.[0]) {
    return data.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
  }
  return [];
}

// ─── Sub-componente: controla câmera do mapa ────────────────────────────────
function MapController({ activePos, isFullscreen }) {
  const map       = useRef(null);
  const leaflet   = useMap();
  const fittedRef = useRef(false);

  // Corrige tiles em branco ao montar
  useEffect(() => {
    const t = setTimeout(() => leaflet.invalidateSize(), 200);
    return () => clearTimeout(t);
  }, [leaflet]);

  // Invalida tamanho ao entrar/sair de fullscreen
  useEffect(() => {
    const t = setTimeout(() => leaflet.invalidateSize(), 300);
    return () => clearTimeout(t);
  }, [isFullscreen, leaflet]);

  useEffect(() => {
    if (!activePos) return;
    if (!fittedRef.current) {
      // Primeira posição: enquadra driver + cliente
      leaflet.fitBounds(L.latLngBounds([activePos, CLIENT_POS]), {
        padding: [70, 70],
        animate: true,
      });
      fittedRef.current = true;
    } else {
      // Segue o motorista suavemente
      leaflet.panTo(activePos, { animate: true, duration: 0.5 });
    }
  }, [activePos, leaflet]);

  return null;
}

// ─── Componente principal ───────────────────────────────────────────────────
function MapCard({ onChegou, coletado }) {
  // GPS
  const [driverPos,    setDriverPos]    = useState(null);
  const [route,        setRoute]        = useState([]);
  const [geoStatus,    setGeoStatus]    = useState('requesting');
  const [geoError,     setGeoError]     = useState('');
  const [distancia,    setDistancia]    = useState(null);

  // Simulação
  const [simulating,   setSimulating]   = useState(false);
  const [simPos,       setSimPos]       = useState(null);
  const [simLoading,   setSimLoading]   = useState(false);

  // Tela cheia
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs (evitam closures stale)
  const mapCardRef     = useRef(null);
  const watchIdRef     = useRef(null);
  const simIntervalRef = useRef(null);
  const simulatingRef  = useRef(false);   // espelho de simulating para callbacks
  const chegouRef      = useRef(false);
  const lastFetchRef   = useRef(null);
  const onChegouRef    = useRef(onChegou);

  useEffect(() => { onChegouRef.current = onChegou; }, [onChegou]);

  // ── Listener de fullscreen ────────────────────────────────────────────────
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapCardRef.current?.requestFullscreen().catch(console.warn);
    } else {
      document.exitFullscreen();
    }
  };

  // ── GPS watchPosition ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGeoStatus('error');
      setGeoError('Geolocalização não suportada neste navegador.');
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        // Ignora GPS enquanto simulação está ativa
        if (simulatingRef.current) return;

        const pos  = [coords.latitude, coords.longitude];
        const dist = Math.round(haversine(pos, CLIENT_POS));

        setDriverPos(pos);
        setGeoStatus('tracking');
        setDistancia(dist);

        // Rebusca rota apenas se deslocou o suficiente
        const moved = !lastFetchRef.current || haversine(pos, lastFetchRef.current) >= REROUTE_MIN_M;
        if (moved) {
          lastFetchRef.current = pos;
          fetchRoute(pos, CLIENT_POS)
            .then(r => { if (r.length > 1) setRoute(r); })
            .catch(() => {});
        }

        // Chegada
        if (!chegouRef.current && dist <= ARRIVAL_RADIUS_M) {
          chegouRef.current = true;
          setGeoStatus('arrived');
          onChegouRef.current?.();
        }
      },
      (err) => {
        setGeoStatus('error');
        const msgs = {
          1: 'Permissão negada. Ative a localização nas configurações do navegador.',
          2: 'Localização indisponível. Verifique se o GPS está ativo.',
          3: 'Tempo esgotado ao obter localização. Tente novamente.',
        };
        setGeoError(msgs[err.code] ?? `Erro de geolocalização (código ${err.code}).`);
      },
      { enableHighAccuracy: true, timeout: 20_000, maximumAge: 0 }
    );

    return () => {
      if (watchIdRef.current != null)
        navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []); // roda uma única vez

  // ── Iniciar simulação ─────────────────────────────────────────────────────
  const startSimulation = async () => {
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);

    simulatingRef.current = true;
    chegouRef.current     = false;

    // Usa a localização GPS real como ponto de partida.
    // Só cai no DRIVER_SIM_START se o GPS ainda não tiver retornado nenhuma posição.
    const startPos = driverPos ?? DRIVER_SIM_START;

    setSimulating(true);
    setSimLoading(true);
    setSimPos(startPos);
    setDistancia(null);

    // Busca a rota a partir da posição atual do motorista até o cliente
    let simRoute = [];
    try {
      simRoute = await fetchRoute(startPos, CLIENT_POS);
    } catch (e) {
      console.warn('[Simulação] Falha ao buscar rota:', e.message);
    }

    setSimLoading(false);

    if (simRoute.length < 2) {
      simulatingRef.current = false;
      setSimulating(false);
      return;
    }

    setRoute(simRoute);
    let step = 0;
    setSimPos(simRoute[0]);

    simIntervalRef.current = setInterval(() => {
      step++;

      // Fim da rota
      if (step >= simRoute.length) {
        clearInterval(simIntervalRef.current);
        simulatingRef.current = false;
        setSimulating(false);
        setSimPos(null);
        chegouRef.current = true;
        onChegouRef.current?.();
        return;
      }

      const pos  = simRoute[step];
      const dist = Math.round(haversine(pos, CLIENT_POS));
      setSimPos(pos);
      setDistancia(dist);

      // Chegada antecipada (dentro do raio)
      if (!chegouRef.current && dist <= ARRIVAL_RADIUS_M) {
        chegouRef.current = true;
        clearInterval(simIntervalRef.current);
        simulatingRef.current = false;
        setSimulating(false);
        onChegouRef.current?.();
      }
    }, SIM_STEP_MS);
  };

  // ── Parar simulação ───────────────────────────────────────────────────────
  const stopSimulation = () => {
    clearInterval(simIntervalRef.current);
    simulatingRef.current = false;
    setSimulating(false);
    setSimPos(null);
    setDistancia(null);
  };

  // Cleanup ao desmontar
  useEffect(() => () => clearInterval(simIntervalRef.current), []);

  // Posição exibida: simulação tem prioridade sobre GPS real
  const displayPos = simulating ? simPos : driverPos;

  const distLabel =
    distancia == null
      ? '...'
      : distancia >= 1000
      ? `${(distancia / 1000).toFixed(1)} km`
      : `${distancia} m`;

  return (
    <div className="map-card" ref={mapCardRef}>

      {/* ── Overlay de permissão / erro GPS (só quando não está simulando) ── */}
      {(geoStatus === 'requesting' || geoStatus === 'error') && !simulating && (
        <div className={`map-overlay ${geoStatus === 'error' ? 'map-overlay--error' : ''}`}>
          <div className="map-permission-box">
            <span className="map-permission-icon">
              {geoStatus === 'error' ? '⚠️' : '📍'}
            </span>
            <p className="map-permission-text">
              {geoStatus === 'error'
                ? geoError
                : 'Aguardando permissão de localização…'}
            </p>
            {geoStatus === 'requesting' && (
              <span className="map-spinner" aria-label="Carregando" />
            )}
          </div>
        </div>
      )}

      {/* ── Mapa Leaflet ──────────────────────────────────────────────────── */}
      <MapContainer
        center={CLIENT_POS}
        zoom={14}
        className="leaflet-map-container"
        zoomControl
        scrollWheelZoom
      >
        <MapController activePos={displayPos} isFullscreen={isFullscreen} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Linha da rota */}
        {route.length > 1 && !coletado && (
          <Polyline
            positions={route}
            color="#4a90e2"
            weight={5}
            opacity={0.85}
          />
        )}

        {/* Marcador do cliente (avatar verde) */}
        <Marker position={CLIENT_POS} icon={clientIcon}>
          <Popup>
            <strong>Vitória Almeida</strong>
            <br />
            Pajuçara, Maceió – AL
          </Popup>
        </Marker>

        {/* Marcador do motorista (caminhão azul) */}
        {displayPos && (
          <Marker position={displayPos} icon={truckIcon}>
            <Popup>
              {simulating ? '🎮 Simulação em andamento' : '🚛 Você está aqui'}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* ── Botão tela cheia (canto superior direito) ─────────────────────── */}
      <button
        className="map-btn-fullscreen"
        onClick={toggleFullscreen}
        title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
        aria-label={isFullscreen ? 'Sair da tela cheia' : 'Abrir tela cheia'}
      >
        {isFullscreen ? '✕' : '⛶'}
      </button>

      {/* ── Barra de simulação (inferior) ────────────────────────────────── */}
      {!coletado && (
        <div className="map-sim-bar">
          {simulating ? (
            <button className="map-sim-btn map-sim-btn--stop" onClick={stopSimulation}>
              {simLoading ? (
                <><span className="map-spinner map-spinner--sm" /> Carregando rota…</>
              ) : (
                <>■ Parar simulação</>
              )}
            </button>
          ) : (
            <button className="map-sim-btn" onClick={startSimulation}>
              ▶ Simular rota
            </button>
          )}
        </div>
      )}

      {/* ── Badge de status (canto superior esquerdo) ────────────────────── */}
      <div
        className={[
          'map-badge',
          coletado    ? 'map-badge--success' : '',
          simulating  ? 'map-badge--sim'     : '',
        ].join(' ')}
      >
        <span className="map-badge-dot" />
        {coletado
          ? '✅ Coleta realizada!'
          : simulating
          ? simLoading
            ? 'Buscando rota…'
            : `🎮 Simulando · ${distLabel}`
          : geoStatus === 'tracking'
          ? `Em rota · ${distLabel}`
          : geoStatus === 'error'
          ? 'GPS indisponível'
          : 'Aguardando GPS…'}
      </div>
    </div>
  );
}

export default MapCard;