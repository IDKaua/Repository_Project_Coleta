import { useState } from "react";
import "./MapaCooperativa.css";

// ── Dados mock ───────────────────────────────────────────────────────────────
const COLETAS = [
  { id: 1, tipo: "coleta", lat: 52,  lng: -10,  label: "Coleta #274 – Europa",    status: "Em Andamento", motorista: "Carlos Silva",   veiculo: "Caminhão XL-07", inicio: "08:30" },
  { id: 2, tipo: "coleta", lat: 40,  lng: -100, label: "Coleta #275 – América N", status: "Em Andamento", motorista: "Ana Souza",      veiculo: "Caminhão XL-02", inicio: "09:00" },
  { id: 3, tipo: "coleta", lat: -15, lng: -55,  label: "Coleta #276 – Brasil",    status: "Em Andamento", motorista: "João Ferreira",  veiculo: "Caminhão XL-11", inicio: "07:45" },
  { id: 4, tipo: "coleta", lat: -30, lng: 25,   label: "Coleta #277 – África S",  status: "Em Andamento", motorista: "Maria Lima",     veiculo: "Caminhão XL-04", inicio: "10:15" },
  { id: 5, tipo: "coleta", lat: 5,   lng: 105,  label: "Coleta #278 – Ásia SE",   status: "Em Andamento", motorista: "Pedro Nunes",    veiculo: "Caminhão XL-09", inicio: "06:30" },
];

const CONTEINERES = [
  { id: 10, tipo: "conteiner", lat: 48,  lng: 15,  label: "Contêiner #40 – Viena",           capacidade: "2.000 kg", ocupacao: "68%", ultimaColeta: "10/04/2025" },
  { id: 11, tipo: "conteiner", lat: 35,  lng: 140, label: "Contêiner #41 – Tóquio",          capacidade: "1.500 kg", ocupacao: "42%", ultimaColeta: "11/04/2025" },
  { id: 12, tipo: "conteiner", lat: 55,  lng: 37,  label: "Contêiner #42 – Moscou",          capacidade: "3.000 kg", ocupacao: "91%", ultimaColeta: "09/04/2025" },
  { id: 13, tipo: "conteiner", lat: 22,  lng: 88,  label: "Contêiner #43 – Calcutá",         capacidade: "1.200 kg", ocupacao: "55%", ultimaColeta: "12/04/2025" },
  { id: 14, tipo: "conteiner", lat: -34, lng: 151, label: "Contêiner #44 – Sydney",          capacidade: "2.500 kg", ocupacao: "30%", ultimaColeta: "13/04/2025" },
  { id: 15, tipo: "conteiner", lat: 19,  lng: -99, label: "Contêiner #45 – Cidade do México",capacidade: "1.800 kg", ocupacao: "77%", ultimaColeta: "11/04/2025" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function latLngToPercent(lat, lng) {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { x, y };
}

// ── Ícones SVG inline ─────────────────────────────────────────────────────────
const IconTruck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 5v3h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const IconBin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);

const IconRecycle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/>
    <path d="M11 19h8.203a1.830 1.830 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/>
    <path d="m14 16 3 3-3 3"/>
    <path d="M8.293 13.596 7.196 9.5 3.1 10.598"/>
    <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/>
    <path d="m13.378 9.633 4.096 1.098 1.097-4.096"/>
  </svg>
);

// ── Componente Principal ──────────────────────────────────────────────────────
export default function MapaOperacional({ embedded = false }) {
  const [showColetas,     setShowColetas]     = useState(true);
  const [showConteineres, setShowConteineres] = useState(true);
  const [selected,        setSelected]        = useState(null);
  const [activeMenu,      setActiveMenu]      = useState("mapas");

  const items = [
    ...(showColetas     ? COLETAS     : []),
    ...(showConteineres ? CONTEINERES : []),
  ];

  return (
    <div className={`mapa-wrapper ${embedded ? "mapa-embedded" : ""}`}>

      {/* ── Navbar — só aparece fora do painel ── */}
      {!embedded && (
        <nav className="mapa-navbar">
          <div className="mapa-brand">
            <IconRecycle />
            <span>EcoTech</span>
          </div>
          <ul className="mapa-nav-links">
            {["Inicio","Serviços","Parceiros","Funções","Campanha","Sobre Nós"].map(l => (
              <li key={l}><a href="#">{l}</a></li>
            ))}
          </ul>
          <button className="mapa-btn-login">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            Faça Login
          </button>
        </nav>
      )}

      <div className="mapa-layout">

        {/* ── Sidebar — só aparece fora do painel ── */}
        {!embedded && (
          <aside className="mapa-sidebar">
            <section className="sidebar-section">
              <h4 className="sidebar-heading">OPERAÇÕES</h4>
              <ul className="sidebar-menu">
                <li
                  className={activeMenu === "gestao" ? "active" : ""}
                  onClick={() => setActiveMenu("gestao")}
                >
                  <IconRecycle /> Administração/Gestão
                </li>
                <li
                  className={activeMenu === "mapas" ? "active" : ""}
                  onClick={() => setActiveMenu("mapas")}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <circle cx="12" cy="10" r="3"/>
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 14 8 14s8-8.75 8-14a8 8 0 0 0-8-8z"/>
                  </svg>
                  Mapas
                </li>
              </ul>
            </section>

            <section className="sidebar-section">
              <h4 className="sidebar-heading">LEGENDA E FILTROS</h4>
              <div className="sidebar-legenda-item">
                <span className="legenda-icon truck"><IconTruck /></span>
                <div>
                  <span className="legenda-label">Coleta em Andamento</span>
                  <span className="legenda-fonte">[fonte: 274]</span>
                </div>
              </div>
              <div className="sidebar-legenda-item">
                <span className="legenda-icon bin"><IconBin /></span>
                <div>
                  <span className="legenda-label">Contêiner Cadastrado</span>
                  <span className="legenda-fonte">[fonte: 40]</span>
                </div>
              </div>
            </section>

            <section className="sidebar-section">
              <h4 className="sidebar-heading-sm">Filtros</h4>
              <label className="sidebar-check">
                <input type="checkbox" checked={showColetas} onChange={e => setShowColetas(e.target.checked)} />
                Exibir Coletas
              </label>
              <label className="sidebar-check">
                <input type="checkbox" checked={showConteineres} onChange={e => setShowConteineres(e.target.checked)} />
                Exibir Contêineres
              </label>
            </section>
          </aside>
        )}

        {/* ── Conteúdo principal ── */}
        <main className="mapa-main">
          <div className="mapa-page-header">
            <h1 className="mapa-titulo">
              MAPA OPERACIONAL <span>– [Nome da Cooperativa Exemplo]</span>
            </h1>
            <p className="mapa-subtitulo">Visão Geral Geográfica de Ativos e Operações</p>
          </div>

          

          <div className="mapa-content-row">
            {/* Mapa */}
            <div className="mapa-card mapa-map-card">
              <div className="mapa-card mapa-legenda-card">
            
            <div className="legenda-row">
              <label className="legenda-check-item">
                <input type="checkbox" checked={showColetas} onChange={e => setShowColetas(e.target.checked)} />
                <span className="legenda-icon-sm truck"><IconTruck /></span>
                Exibir Coletas
              </label>
              <label className="legenda-check-item">
                <input type="checkbox" checked={showConteineres} onChange={e => setShowConteineres(e.target.checked)} />
                <span className="legenda-icon-sm bin"><IconBin /></span>
                Exibir Contêineres
              </label>
            </div>
          </div>
              <div className="mapa-map-area">
                <svg className="world-svg" viewBox="0 0 1000 500"
                  xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                  <rect width="1000" height="500" fill="#b8d8cc" rx="8"/>
                  <path d="M80,60 L200,55 L230,90 L240,130 L220,180 L190,220 L170,250 L150,270 L120,260 L100,230 L90,200 L70,170 L60,130 L65,90 Z" fill="#d4ead8" stroke="#a0c8a8" strokeWidth="1.5"/>
                  <path d="M150,270 L175,280 L185,310 L170,325 L155,315 L145,295 Z" fill="#d4ead8" stroke="#a0c8a8" strokeWidth="1"/>
                  <path d="M175,330 L220,320 L250,340 L265,380 L255,430 L230,460 L200,465 L175,450 L160,420 L155,380 L160,350 Z" fill="#d4ead8" stroke="#a0c8a8" strokeWidth="1.5"/>
                  <path d="M440,60 L510,55 L525,80 L515,110 L495,120 L470,115 L450,100 L435,80 Z" fill="#d4ead8" stroke="#a0c8a8" strokeWidth="1.5"/>
                  <path d="M450,155 L510,145 L540,170 L545,220 L535,280 L510,330 L480,355 L455,340 L435,300 L430,250 L435,200 Z" fill="#d4ead8" stroke="#a0c8a8" strokeWidth="1.5"/>
                  <path d="M525,55 L700,45 L780,60 L810,90 L800,130 L760,150 L720,160 L680,155 L640,145 L600,140 L565,125 L540,100 Z" fill="#d4ead8" stroke="#a0c8a8" strokeWidth="1.5"/>
                  <path d="M640,155 L670,170 L665,210 L645,235 L625,210 L625,175 Z" fill="#d4ead8" stroke="#a0c8a8" strokeWidth="1"/>
                  <path d="M740,165 L790,160 L810,185 L800,210 L770,215 L745,200 Z" fill="#d4ead8" stroke="#a0c8a8" strokeWidth="1"/>
                  <path d="M750,310 L840,300 L875,330 L870,380 L840,410 L790,415 L755,390 L740,355 Z" fill="#d4ead8" stroke="#a0c8a8" strokeWidth="1.5"/>
                  <ellipse cx="850" cy="120" rx="18" ry="30" fill="#d4ead8" stroke="#a0c8a8" strokeWidth="1" transform="rotate(-20,850,120)"/>
                  <path d="M280,20 L350,18 L365,45 L340,65 L295,60 Z" fill="#d4ead8" stroke="#a0c8a8" strokeWidth="1"/>
                </svg>

                {items.map(item => {
                  const { x, y } = latLngToPercent(item.lat, item.lng);
                  const isSelected = selected?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      className={`map-pin ${item.tipo} ${isSelected ? "selected" : ""}`}
                      style={{ left: `${x}%`, top: `${y}%` }}
                      onClick={() => setSelected(item)}
                      title={item.label}
                    >
                      {item.tipo === "coleta" ? <IconTruck /> : <IconBin />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detalhes */}
            <div className="mapa-card mapa-details-card">
              <h3 className="details-title">DETALHES SELECIONADOS</h3>
              {selected ? (
                <>
                  <span className="details-badge">
                    {selected.tipo === "coleta" ? "Coleta" : "Contêiner"}
                  </span>
                  <p className="details-name">{selected.label}</p>
                  <div className="details-divider"/>
                  {selected.tipo === "coleta" ? (
                    <ul className="details-list">
                      <li><span>Status</span><strong>{selected.status}</strong></li>
                      <li><span>Motorista</span><strong>{selected.motorista}</strong></li>
                      <li><span>Veículo</span><strong>{selected.veiculo}</strong></li>
                      <li><span>Início</span><strong>{selected.inicio}</strong></li>
                    </ul>
                  ) : (
                    <ul className="details-list">
                      <li><span>Capacidade</span><strong>{selected.capacidade}</strong></li>
                      <li><span>Ocupação</span><strong>{selected.ocupacao}</strong></li>
                      <li><span>Última Coleta</span><strong>{selected.ultimaColeta}</strong></li>
                    </ul>
                  )}
                </>
              ) : (
                <div className="details-empty">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                    <circle cx="12" cy="10" r="3"/>
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 14 8 14s8-8.75 8-14a8 8 0 0 0-8-8z"/>
                  </svg>
                  <p>Selecione um item no mapa para ver detalhes</p>
                </div>
              )}
            </div>
          </div>

          {/* Legenda inferior */}
          
        </main>
      </div>

      {/* ── Footer — só aparece fora do painel ── */}
      {!embedded && (
        <footer className="mapa-footer">
          EcoTec – Plataforma de Gestão de Resíduos Eletrônicos | 2023
        </footer>
      )}
    </div>
  );
}