import { useState } from "react";
import "./MapaCooperativa.css";
import { IconTruck, IconBin, IconRecycle } from "./Mapaicones";
import MapaMundi from "./Mapa";
import MapaDetalhes from "./Mapadetalhes";

const COLETAS = [
  { id: 1, tipo: "coleta", lat: 52,  lng: -10,  label: "Coleta #274 – Europa",    status: "Em Andamento", motorista: "Carlos Silva",  veiculo: "Caminhão XL-07", inicio: "08:30" },
  { id: 2, tipo: "coleta", lat: 40,  lng: -100, label: "Coleta #275 – América N", status: "Em Andamento", motorista: "Ana Souza",     veiculo: "Caminhão XL-02", inicio: "09:00" },
  { id: 3, tipo: "coleta", lat: -15, lng: -55,  label: "Coleta #276 – Brasil",    status: "Em Andamento", motorista: "João Ferreira", veiculo: "Caminhão XL-11", inicio: "07:45" },
  { id: 4, tipo: "coleta", lat: -30, lng: 25,   label: "Coleta #277 – África S",  status: "Em Andamento", motorista: "Maria Lima",    veiculo: "Caminhão XL-04", inicio: "10:15" },
  { id: 5, tipo: "coleta", lat: 5,   lng: 105,  label: "Coleta #278 – Ásia SE",   status: "Em Andamento", motorista: "Pedro Nunes",   veiculo: "Caminhão XL-09", inicio: "06:30" },
];

const CONTEINERES = [
  { id: 10, tipo: "conteiner", lat: 48,  lng: 15,  label: "Contêiner #40 – Viena",          capacidade: "2.000 kg", ocupacao: "68%", ultimaColeta: "10/04/2025" },
  { id: 11, tipo: "conteiner", lat: 35,  lng: 140, label: "Contêiner #41 – Tóquio",          capacidade: "1.500 kg", ocupacao: "42%", ultimaColeta: "11/04/2025" },
  { id: 12, tipo: "conteiner", lat: 55,  lng: 37,  label: "Contêiner #42 – Moscou",          capacidade: "3.000 kg", ocupacao: "91%", ultimaColeta: "09/04/2025" },
  { id: 13, tipo: "conteiner", lat: 22,  lng: 88,  label: "Contêiner #43 – Calcutá",         capacidade: "1.200 kg", ocupacao: "55%", ultimaColeta: "12/04/2025" },
  { id: 14, tipo: "conteiner", lat: -34, lng: 151, label: "Contêiner #44 – Sydney",          capacidade: "2.500 kg", ocupacao: "30%", ultimaColeta: "13/04/2025" },
  { id: 15, tipo: "conteiner", lat: 19,  lng: -99, label: "Contêiner #45 – Cidade do México",capacidade: "1.800 kg", ocupacao: "77%", ultimaColeta: "11/04/2025" },
];

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

      {!embedded && (
        <nav className="mapa-navbar">
          <div className="mapa-brand"><IconRecycle /><span>EcoTech</span></div>
          <ul className="mapa-nav-links">
            {["Inicio","Serviços","Parceiros","Funções","Campanha","Sobre Nós"].map(l => (
              <li key={l}><a href="#">{l}</a></li>
            ))}
          </ul>
          <button className="mapa-btn-login">Faça Login</button>
        </nav>
      )}

      <div className="mapa-layout">
        {!embedded && (
          <aside className="mapa-sidebar">
            <section className="sidebar-section">
              <h4 className="sidebar-heading">OPERAÇÕES</h4>
              <ul className="sidebar-menu">
                <li className={activeMenu === "gestao" ? "active" : ""} onClick={() => setActiveMenu("gestao")}>
                  <IconRecycle /> Administração/Gestão
                </li>
                <li className={activeMenu === "mapas" ? "active" : ""} onClick={() => setActiveMenu("mapas")}>
                  Mapas
                </li>
              </ul>
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

        <main className="mapa-main">
          <div className="mapa-page-header">
            <h1 className="mapa-titulo">MAPA OPERACIONAL <span>– [Nome da Cooperativa]</span></h1>
            <p className="mapa-subtitulo">Visão Geral Geográfica de Ativos e Operações</p>
          </div>

          {embedded && (
            <div className="mapa-filtros-embedded">
              <label className="sidebar-check">
                <input type="checkbox" checked={showColetas} onChange={e => setShowColetas(e.target.checked)} />
                Exibir Coletas
              </label>
              <label className="sidebar-check">
                <input type="checkbox" checked={showConteineres} onChange={e => setShowConteineres(e.target.checked)} />
                Exibir Contêineres
              </label>
            </div>
          )}

          <div className="mapa-content-row">
            <MapaMundi items={items} selected={selected} onSelect={setSelected} />
            <MapaDetalhes selected={selected} />
          </div>
        </main>
      </div>

      {!embedded && (
        <footer className="mapa-footer">
          EcoTec – Plataforma de Gestão de Resíduos Eletrônicos | 2023
        </footer>
      )}
    </div>
  );
}