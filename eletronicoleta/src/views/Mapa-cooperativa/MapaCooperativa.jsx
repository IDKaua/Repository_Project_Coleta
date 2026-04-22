import { useState } from "react";
import "./MapaCooperativa.css";
import { IconRecycle } from "./Mapaicones";
import MapaMundi from "./Mapa";
import MapaDetalhes from "./Mapadetalhes";

// COORDENADAS CORRIGIDAS: Cada ponto exatamente em sua rua no Vergel, Prado, Trapiche e Levada.
const COLETAS = [
  { id: 1, tipo: "coleta", lat: -9.6635, lng: -35.7033, label: "Rota Orla Ponta Verde", status: "Em Trânsito", motorista: "Carlos Silva", veiculo: "Caminhão Compactador", inicio: "08:30", destino: "Av. Silvio Carlos Viana" },
  { id: 2, tipo: "coleta", lat: -9.6710, lng: -35.7145, label: "Rota Pajuçara", status: "Carregando", motorista: "Ana Souza", veiculo: "Caminhão Leve", inicio: "09:00", destino: "Av. Dr. Antônio Gouveia" },
  { id: 3, tipo: "coleta", lat: -9.6465, lng: -35.6980, label: "Rota Jatiúca", status: "Em Andamento", motorista: "João Ferreira", veiculo: "Caminhão XL-11", inicio: "07:45", destino: "Av. Álvaro Otacílio" },
  { id: 4, tipo: "coleta", lat: -9.6385, lng: -35.7180, label: "Rota Jacintinho", status: "Em Trânsito", motorista: "Paulo Mendes", veiculo: "Caminhão Compactador", inicio: "08:15", destino: "Rua Cleto Campelo" },
  { id: 5, tipo: "coleta", lat: -9.6250, lng: -35.7255, label: "Rota Feitosa", status: "Em Andamento", motorista: "Roberto Alves", veiculo: "Caminhão Baú", inicio: "10:00", destino: "Av. Gov. Lamenha Filho" },
  { id: 6, tipo: "coleta", lat: -9.6200, lng: -35.6985, label: "Rota Cruz das Almas", status: "Finalizando", motorista: "Marcos Vinicius", veiculo: "Caminhão XL-02", inicio: "06:45", destino: "Av. Brigadeiro Eduardo Gomes" },
  
  // PONTOS CORRIGIDOS E REPOSICIONADOS
  { id: 7, tipo: "coleta", lat: -9.6775, lng: -35.7505, label: "Rota Trapiche da Barra", status: "Em Andamento", motorista: "Luciano Costa", veiculo: "Caminhão Compactador", inicio: "09:30", destino: "Av. Siqueira Campos" },
  { id: 8, tipo: "coleta", lat: -9.6685, lng: -35.7415, label: "Rota Prado", status: "Em Trânsito", motorista: "Fernando Dias", veiculo: "Caminhão Leve", inicio: "08:00", destino: "Praça da Faculdade" },
  { id: 9, tipo: "coleta", lat: -9.6665, lng: -35.7580, label: "Rota Vergel - Senador Rui Palmeira", status: "Em Andamento", motorista: "José Almir", veiculo: "Caminhão Compactador", inicio: "07:15", destino: "Av. Senador Rui Palmeira" },
  { id: 22, tipo: "coleta", lat: -9.6610, lng: -35.7520, label: "Rota Vergel - Largo", status: "Em Trânsito", motorista: "Pedro Henrique", veiculo: "Caminhão Leve", inicio: "08:45", destino: "Rua Largo da Pólvora" },
  { id: 26, tipo: "coleta", lat: -9.6605, lng: -35.7495, label: "Rota Vergel - Bom Retiro", status: "Carregando", motorista: "Mário Jorge", veiculo: "Caminhão Leve", inicio: "10:15", destino: "Rua Bom Retiro" },
];

const CONTEINERES = [
  { id: 10, tipo: "conteiner", lat: -9.6655, lng: -35.7355, label: "PEV Centro", capacidade: "1.000 kg", ocupacao: "85%", ultimaColeta: "14/04/2026", endereco: "Rua do Comércio, s/n" },
  { id: 11, tipo: "conteiner", lat: -9.6540, lng: -35.7315, label: "PEV Farol", capacidade: "800 kg", ocupacao: "30%", ultimaColeta: "13/04/2026", endereco: "Av. Fernandes Lima, 1000" },
  { id: 12, tipo: "conteiner", lat: -9.5855, lng: -35.7380, label: "PEV Benedito Bentes", capacidade: "1.200 kg", ocupacao: "92%", ultimaColeta: "14/04/2026", endereco: "Av. Benedito Bentes" },
  { id: 16, tipo: "conteiner", lat: -9.6580, lng: -35.7480, label: "PEV Bom Parto", capacidade: "1.000 kg", ocupacao: "40%", ultimaColeta: "16/04/2026", endereco: "Rua General Hermes" },
  { id: 17, tipo: "conteiner", lat: -9.6550, lng: -35.7250, label: "PEV Poço", capacidade: "1.200 kg", ocupacao: "55%", ultimaColeta: "15/04/2026", endereco: "Praça 13 de Maio" },
  { id: 18, tipo: "conteiner", lat: -9.6680, lng: -35.7250, label: "PEV Jaraguá", capacidade: "2.000 kg", ocupacao: "72%", ultimaColeta: "14/04/2026", endereco: "Rua Sá e Albuquerque" },
  { id: 19, tipo: "conteiner", lat: -9.6630, lng: -35.7160, label: "PEV Ponta da Terra", capacidade: "800 kg", ocupacao: "20%", ultimaColeta: "16/04/2026", endereco: "Rua Domingos Lordsleen" },
  { id: 20, tipo: "conteiner", lat: -9.6420, lng: -35.7350, label: "PEV Pitanguinha", capacidade: "1.000 kg", ocupacao: "60%", ultimaColeta: "13/04/2026", endereco: "Rua Miguel Palmeira" },
  { id: 21, tipo: "conteiner", lat: -9.6425, lng: -35.7040, label: "PEV Mangabeiras", capacidade: "1.500 kg", ocupacao: "81%", ultimaColeta: "15/04/2026", endereco: "Av. Comendador Gustavo Paiva" },
  
  // PONTOS CORRIGIDOS E REPOSICIONADOS
  { id: 13, tipo: "conteiner", lat: -9.6720, lng: -35.7460, label: "PEV Ponta Grossa", capacidade: "1.000 kg", ocupacao: "65%", ultimaColeta: "15/04/2026", endereco: "Rua Cabo Reis" },
  { id: 14, tipo: "conteiner", lat: -9.6725, lng: -35.7585, label: "PEV Vergel - Orla Lagunar", capacidade: "1.500 kg", ocupacao: "88%", ultimaColeta: "14/04/2026", endereco: "Av. Senador Rui Palmeira" },
  { id: 15, tipo: "conteiner", lat: -9.6640, lng: -35.7410, label: "PEV Levada", capacidade: "800 kg", ocupacao: "95%", ultimaColeta: "12/04/2026", endereco: "Mercado da Produção" },
  { id: 23, tipo: "conteiner", lat: -9.6690, lng: -35.7495, label: "PEV Vergel - Interno", capacidade: "1.200 kg", ocupacao: "90%", ultimaColeta: "19/04/2026", endereco: "Rua Marquês de Pombal" },
  { id: 24, tipo: "conteiner", lat: -9.6635, lng: -35.7515, label: "PEV Vergel - Monte Castelo", capacidade: "800 kg", ocupacao: "70%", ultimaColeta: "17/04/2026", endereco: "Avenida Monte Castelo" },
  { id: 25, tipo: "conteiner", lat: -9.6675, lng: -35.7485, label: "PEV Vergel - Cabo Reis", capacidade: "1.000 kg", ocupacao: "45%", ultimaColeta: "18/04/2026", endereco: "Rua Cabo Reis" },
  { id: 27, tipo: "conteiner", lat: -9.6665, lng: -35.7530, label: "PEV Vergel - São João", capacidade: "1.000 kg", ocupacao: "85%", ultimaColeta: "19/04/2026", endereco: "Rua São João" }
];

export default function MapaOperacional({ embedded = false }) {
  const [showColetas, setShowColetas] = useState(true);
  const [showConteineres, setShowConteineres] = useState(true);
  const [selected, setSelected] = useState(null);
  const [activeMenu, setActiveMenu] = useState("mapas");

  const items = [
    ...(showColetas ? COLETAS : []),
    ...(showConteineres ? CONTEINERES : []),
  ];

  return (
    <div className={`mapa-wrapper ${embedded ? "mapa-embedded" : ""}`}>
      {!embedded && (
        <nav className="mapa-navbar">
          <div className="mapa-brand">
            <IconRecycle /><span>EcoTech Maceió</span>
          </div>
          <ul className="mapa-nav-links">
            {["Inicio", "Serviços", "Parceiros", "Funções", "Campanha", "Sobre Nós"].map(l => (
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
              <h4 className="sidebar-heading">OPERAÇÕES LOCAIS</h4>
              <ul className="sidebar-menu">
                <li 
                  className={activeMenu === "mapas" ? "active" : ""} 
                  onClick={() => setActiveMenu("mapas")}
                >
                  Mapas
                </li>
              </ul>
            </section>

            <section className="sidebar-section">
              <h4 className="sidebar-heading-sm">Filtros de Área</h4>
              <label className="sidebar-check">
                <input 
                  type="checkbox" 
                  checked={showColetas}
                  onChange={e => setShowColetas(e.target.checked)} 
                />
                Caminhões em Rota
              </label>
              <label className="sidebar-check">
                <input 
                  type="checkbox" 
                  checked={showConteineres}
                  onChange={e => setShowConteineres(e.target.checked)} 
                />
                Pontos de Entrega (PEV)
              </label>
            </section>
          </aside>
        )}

        <main className="mapa-main">
          <div className="mapa-page-header">
            <h1 className="mapa-titulo">MONITORAMENTO URBANO <span>- Maceió/AL</span></h1>
            <p className="mapa-subtitulo">Acompanhamento em tempo real dos ativos na capital alagoana.</p>
          </div>

          <div className="mapa-content-row">
            <MapaMundi items={items} selected={selected} onSelect={setSelected} />
            <MapaDetalhes selected={selected} />
          </div>
        </main>
      </div>
    </div>
  );
}