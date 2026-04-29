import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PainelCooperativa.css";
import "./Paineltabelas.css";
import MapaOperacional from "../Mapa-cooperativa/MapaCooperativa";
import Sidebar from "./sideBar";
import FilaColetas from "./Filacoleta";
import { ListaColetores, ListaConteineres } from "./ListasTabelas";
import PainelTriagem from "./PainelTriagem";

const COLETAS_MOCK = [
  {
    id: "COL-001",
    tipoEquipamento: "Computadores",
    quantidade: 3,
    porte: "Pequeno",
  },
  {
    id: "COL-002",
    tipoEquipamento: "Celulares",
    quantidade: 10,
    porte: "Médio",
  },
  {
    id: "COL-003",
    tipoEquipamento: "Eletrodomésticos",
    quantidade: 1,
    porte: "Grande",
  },
];

const PainelCooperativa = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("coletas");

  const filaColetasRef = useRef(null);
  const coletoresRef = useRef(null);

  const [coletas, setColetas] = useState(
    COLETAS_MOCK.map((c) => ({
      ...c,
      status: "Pendente",
      coletorAtribuido: null,
    }))
  );

  const [coletaParaAtribuir, setColetaParaAtribuir] = useState(null);

  const handleAtribuirColetor = (idColeta, nomeColetor) => {
    setColetas((prev) =>
      prev.map((c) =>
        c.id === idColeta
          ? { ...c, status: "Em andamento", coletorAtribuido: nomeColetor }
          : c
      )
    );

    setColetaParaAtribuir(null);

    // 🔼 SCROLL PRA CIMA (fila)
    filaColetasRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="painel-wrapper">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <main className="painel-main">
        {activeView === "coletas" ? (
          <>
            <div className="painel-breadcrumb">
              <span
                onClick={() => navigate("/home")}
                className="breadcrumb-link"
              >
                Início
              </span>
              <i className="fas fa-chevron-right breadcrumb-sep"></i>
              <span className="breadcrumb-current">
                Painel da Cooperativa
              </span>
            </div>

            <h1 className="painel-titulo">
              PAINEL DA COOPERATIVA{" "}
              <span className="titulo-sub">(Gestão e Triagem)</span>
            </h1>
            <p className="painel-subtitulo">
              Operações e Fluxo de Trabalho
            </p>

            <div className="painel-grid">
              <div className="painel-coluna-esq">

                {/* 🔽 AQUI ESTÁ A MÁGICA */}
                <FilaColetas
                  ref={filaColetasRef}
                  coletas={coletas}
                  onSelectColeta={(id) => {
                    setColetaParaAtribuir(id);

                    // 🔽 SCROLL PRA BAIXO (coletores)
                    setTimeout(() => {
                      coletoresRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }, 100);
                  }}
                />

                <ListaColetores
                  ref={coletoresRef}
                  estaAtribuindo={!!coletaParaAtribuir}
                  onSelect={(nome) =>
                    handleAtribuirColetor(coletaParaAtribuir, nome)
                  }
                />

                <ListaConteineres />
              </div>

              <div className="painel-coluna-dir">
                <PainelTriagem coletas={coletas} />
              </div>
            </div>

            <footer className="painel-footer">
              EcoTec — Plataforma de Gestão Operacional |{" "}
              {new Date().getFullYear()}
            </footer>
          </>
        ) : (
          <MapaOperacional embedded={true} />
        )}
      </main>
    </div>
  );
};

export default PainelCooperativa;