import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./PainelCooperativa.css";
import "./Paineltabelas.css";
import MapaOperacional from "../Mapa-cooperativa/MapaCooperativa";
import Sidebar from "./sideBar";
import FilaColetas from "./Filacoleta";
import { ListaColetores, ListaConteineres } from "./ListasTabelas";
//import PainelTriagem from "./PainelTriagem";

const PainelCooperativa = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("coletas");

  const filaColetasRef = useRef(null);
  const coletoresRef = useRef(null);

  const [coletas, setColetas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [coletaParaAtribuir, setColetaParaAtribuir] = useState(null);

  const buscarColetas = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/coletas/all");

      if (response.ok) {
        const dados = await response.json();

        const formatadas = dados.map((c) => ({
          id: c.id,
          tipoEquipamento: c.tipoResiduo,
          quantidade: c.descricao?.match(/Coleta de (\d+) item/)?.[1] || 1,
          porte: c.descricao?.match(/porte (\w+)/)?.[1] || "Pequeno",
          status:
            c.status === "PENDENTE"
              ? "Pendente"
              : c.status === "COLETADO"
              ? "Concluída"
              : "Em andamento",
          coletorAtribuido: c.coletor ? c.coletor.nome : null,
        }));

        setColetas(formatadas);
      }
    } catch (error) {
      console.error("Erro ao buscar coletas:", error);
    } finally {
      setCarregando(false);
    }
  };
  
  useEffect(() => {
    buscarColetas();

    const interval = setInterval(buscarColetas, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleAtribuirColetor = async (idColeta, coletor) => {
    if (!idColeta) {
      toast.error("Nenhuma coleta selecionada.");
      return;
    }

    if (coletor && coletor.id) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/coletas/atribuir/${idColeta}/${coletor.id}`,
          {
            method: "PUT",
          }
        );

        if (response.ok) {
          toast.success(`Coletor ${coletor.nome} atribuído com sucesso!`);
          buscarColetas();
        } else {
          toast.error("Erro ao atribuir coletor no servidor.");
        }
      } catch (error) {
        console.error("Erro ao atribuir coletor:", error);
        toast.error("Erro ao conectar com o servidor.");
      }
    } else {
      setColetas((prev) =>
        prev.map((c) =>
          c.id === idColeta
            ? {
                ...c,
                status: "Em andamento",
                coletorAtribuido:
                  typeof coletor === "string"
                    ? coletor
                    : coletor?.nome || "Carlos Silva",
              }
            : c
        )
      );

      toast.success("Coletor atribuído com sucesso!");
    }

    setColetaParaAtribuir(null);

    filaColetasRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleFinalizarColeta = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/coletas/finalizar/${id}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        toast.success(`Coleta #${id} finalizada com sucesso!`);
        buscarColetas();
      } else {
        toast.error("Erro ao finalizar coleta.");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao finalizar.");
    }
  };
 const handleExcluirColeta = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/coletas/excluir/${id}`,
      {
        method: "DELETE",
      }
    );

    const mensagem = await response.text();

    if (response.ok) {
      toast.success(mensagem);

      setColetas((prev) =>
        prev.filter((c) => c.id !== id)
      );
    } else {
      console.error(mensagem);
      toast.error(mensagem);
    }

  } catch (error) {
    console.error(error);
    toast.error("Erro ao conectar ao servidor");
  }
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
              <span className="titulo-sub"></span>
            </h1>

            <div className="painel-grid">
              <div className="painel-coluna-esq">
                {carregando ? (
                  <p>Carregando coletas...</p>
                ) : (
                  <FilaColetas
                    ref={filaColetasRef}
                    coletas={coletas}
                    onFinalizar={handleFinalizarColeta}
                    onExcluir={handleExcluirColeta}
                    onSelectColeta={(id) => {
                      setColetaParaAtribuir(id);

                      setTimeout(() => {
                        coletoresRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }, 100);
                    }}
                  />
                )}

                <ListaColetores
                  ref={coletoresRef}
                  estaAtribuindo={!!coletaParaAtribuir}
                  onSelect={(coletor) =>
                    handleAtribuirColetor(coletaParaAtribuir, coletor)
                  }
                  onCancelar={() => setColetaParaAtribuir(null)}
                />

                <ListaConteineres />
              </div>

              <div className="painel-coluna-dir">
                {/* <PainelTriagem coletas={coletas} /> */}
              </div>
            </div>
          </>
        ) : (
          <MapaOperacional embedded={true} />
        )}
      </main>
    </div>
  );
};

export default PainelCooperativa;