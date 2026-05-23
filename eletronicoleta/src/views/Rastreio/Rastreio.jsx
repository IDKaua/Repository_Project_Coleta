import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Rastreio.css";
import MapaRastreio from "./MapaRastreio";

const Rastreio = () => {
  const navigate = useNavigate();
  const [tempo, setTempo] = useState(15);
  const [coletaAtiva, setColetaAtiva] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  useEffect(() => {
    const buscarColeta = async () => {
      if (!usuarioLogado) return;

      try {
        const response = await fetch("http://localhost:8080/api/coletas/all");

        if (response.ok) {
          const coletas = await response.json();

          const minhaColeta = coletas
            .filter(
              (c) =>
                c.morador?.id === usuarioLogado.id && c.status !== "COLETADO",
            )
            .reverse()[0];

          if (minhaColeta) {
            setColetaAtiva(minhaColeta);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar coleta:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarColeta();
  }, [usuarioLogado?.id]);

  useEffect(() => {
    if (tempo > 0 && coletaAtiva) {
      const timer = setInterval(() => {
        setTempo((prev) => prev - 1);
      }, 1500);

      return () => clearInterval(timer);
    }
  }, [tempo, coletaAtiva]);

  const handleConcluir = async () => {
    if (!coletaAtiva) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/coletas/finalizar/${coletaAtiva.id}`,
        {
          method: "PUT",
        },
      );

      if (response.ok) {
        toast.success("✨ Coleta finalizada com sucesso!");

        // Dispara evento para o Header remover o link de rastreio
        try {
          localStorage.setItem('rastreioOcultoUntil', String(Date.now() + 2 * 60 * 1000));
        } catch (e) {}
        setTimeout(() => {
          window.dispatchEvent(new Event("coletaConcluida"));
        }, 100);

        setTimeout(() => {
          navigate("/minha-conta");
        }, 2000);
      } else {
        toast.error("Erro ao finalizar coleta.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro de conexão.");
    }
  };

  if (carregando) {
    return (
      <div className="rastreio-wrapper">
        <p>Carregando rastreio...</p>
      </div>
    );
  }

  if (!coletaAtiva) {
    // Redireciona automaticamente para solicitar coleta se não há nenhuma ativa
    setTimeout(() => {
      navigate("/solicitar-coleta", { replace: true });
    }, 500);

    return (
      <div className="rastreio-wrapper">
        <main
          className="rastreio-container"
          style={{
            textAlign: "center",
            padding: "50px",
          }}
        >
          <h2>Redirecionando...</h2>
          <p>
            Você não possui uma coleta ativa. Redirecionando para solicitar uma
            coleta.
          </p>
        </main>
      </div>
    );
  }

  const isPendente =
    coletaAtiva.status === "PENDENTE" || coletaAtiva.status === "Pendente";

  return (
    <div className="rastreio-wrapper">
      <main className="rastreio-container">
        <h1 className="titulo-sessao">
          RASTREAMENTO DA COLETA #{coletaAtiva.id}
        </h1>

        <div className="rastreio-flex-layout">
          <div className="mapa-secao">
            <div className="mapa-container-high">
              {/* removi mapa duplicado */}
              <MapaRastreio status={coletaAtiva.status} />
            </div>
          </div>

          <div className="cards-secao">
            {isPendente ? (
              <>
                <div className="mini-card aguardando-card">
                  <div className="status-header">
                    <span className="pulse-dot-yellow"></span>

                    <span
                      style={{
                        color: "#d97706",
                        fontWeight: "bold",
                      }}
                    >
                      Aguardando Cooperativa
                    </span>
                  </div>

                  <h3>Designação de Coletor</h3>

                  <p>
                    Sua solicitação foi recebida. A cooperativa está
                    selecionando o coletor.
                  </p>
                </div>

                <div className="mini-card stepper-card">
                  <h4>ETAPAS DA SOLICITAÇÃO</h4>

                  <div className="stepper-vertical">
                    <div className="step-item completed">
                      <strong>Solicitação criada</strong>
                    </div>

                    <div className="step-item active">
                      <strong>Triagem e escala</strong>
                    </div>

                    <div className="step-item pending">
                      <strong>Coletor a caminho</strong>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mini-card driver-chat-card">
                  <div className="rating-pill">⭐ 4.8</div>

                  <div className="driver-header">
                    <div className="avatar-circle">
                      <i className="fas fa-user"></i>
                    </div>

                    <div className="driver-meta">
                      <h3>{coletaAtiva.coletor?.nome || "Carlos Silva"}</h3>
                    </div>
                  </div>

                  <p className="vehicle-text">
                    {coletaAtiva.coletor?.placaVeiculo
                      ? `Van - ${coletaAtiva.coletor.placaVeiculo}`
                      : "Van - ABC1234"}
                  </p>

                  <button className="btn-chat-motorista">CONVERSAR</button>
                </div>

                <div className="mini-card status-info-card">
                  <div className="status-header">
                    <i className="fas fa-clock"></i>

                    <span>Status da Entrega</span>
                  </div>

                  {tempo > 0 ? (
                    <>
                      <h2 className="tempo-texto">{tempo} min</h2>

                      <p>O coletor está a caminho</p>
                    </>
                  ) : (
                    <>
                      <h2 className="chegou-texto">Seu coletor chegou!</h2>

                      <p>Entregue os resíduos</p>

                      <button
                        className="btn-concluir-rastreio"
                        onClick={handleConcluir}
                      >
                        CONFIRMAR COLETA
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

            <div className="mini-card info-coleta-card">
              <h4>RESUMO DA COLETA</h4>

              <div className="info-item">
                <strong>Tipo:</strong>
                <span> {coletaAtiva.tipoResiduo}</span>
              </div>

              <div className="info-item">
                <strong>Endereço:</strong>

                <span> {coletaAtiva.endereco || "Endereço cadastrado"}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Rastreio;
