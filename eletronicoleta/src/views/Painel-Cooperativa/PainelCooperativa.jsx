import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PainelCooperativa.css";
import MapaOperacional from "./MapaCooperativa";

import Sidebar from "./sideBar";
import FilaColetas from "./Filacoleta"
import { ListaColetores, ListaConteineres } from "./ListasTabelas";
import PainelTriagem from "./PainelTriagem";

const COLETAS_MOCK = [
  { id: "COL-001", tipoEquipamento: "Computadores",     quantidade: 3,  porte: "Pequeno" },
  { id: "COL-002", tipoEquipamento: "Celulares",        quantidade: 10, porte: "Médio"   },
  { id: "COL-003", tipoEquipamento: "Eletrodomésticos", quantidade: 1,  porte: "Grande"  },
];

const PainelCooperativa = () => {
  const navigate = useNavigate();
  const [coletas] = useState(COLETAS_MOCK);
  const [activeView, setActiveView] = useState("coletas");

  return (
    <div className="painel-wrapper">
       <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <main className="painel-main">
          {activeView === "coletas" ? (
             <>
        <div className="painel-breadcrumb">
          <span onClick={() => navigate("/home")} className="breadcrumb-link">Início</span>
          <i className="fas fa-chevron-right breadcrumb-sep"></i>
          <span className="breadcrumb-current">Painel da Cooperativa</span>
        </div>

        <h1 className="painel-titulo">
          PAINEL DA COOPERATIVA <span className="titulo-sub">(Gestão e Triagem)</span>
        </h1>
        <p className="painel-subtitulo">Operações e Fluxo de Trabalho</p>

        <div className="painel-grid">
          <div className="painel-coluna-esq">
            <FilaColetas coletas={coletas} />
            <ListaColetores />
            <ListaConteineres />
          </div>
          <div className="painel-coluna-dir">
            <PainelTriagem coletas={coletas} />
          </div>
        </div>

        <footer className="painel-footer">
          EcoTec — Plataforma de Gestão Operacional | {new Date().getFullYear()}
        </footer>
        </>
        ) : (
          // renderiza o mapa direto aqui
          <MapaOperacional  embedded={true}/>
        )}
      </main>
    </div>
  );
};

export default PainelCooperativa;