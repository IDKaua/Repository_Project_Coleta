import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Rastreio.css";
import MapaRastreio from "./MapaRastreio";

const Rastreio = () => {
  const navigate = useNavigate();
  const [coletaAtiva, setColetaAtiva]     = useState(null);
  const [carregando, setCarregando]       = useState(true);

  // Duração total da rota (segundos) e progresso 0→1 vindos do MapaRastreio
  const [rotaDuracao, setRotaDuracao]     = useState(null);
  const [rotaProgresso, setRotaProgresso] = useState(0);

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
              (c) => c.morador?.id === usuarioLogado.id && c.status !== "COLETADO"
            )
            .reverse()[0];
          if (minhaColeta) setColetaAtiva(minhaColeta);
        }
      } catch (error) {
        console.error("Erro ao buscar coleta:", error);
      } finally {
        setCarregando(false);
      }
    };
    buscarColeta();
  }, [usuarioLogado?.id]);

  // Tempo restante em minutos, diminui conforme o caminhão avança
  const tempoRestante =
    rotaDuracao != null
      ? Math.max(0, Math.round((rotaDuracao * (1 - rotaProgresso)) / 60))
      : null;

  const chegou = rotaProgresso >= 1;

  const handleConcluir = async () => {
    if (!coletaAtiva) return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/coletas/finalizar/${coletaAtiva.id}`,
        { method: "PUT" }
      );
      if (response.ok) {
        toast.success("✨ Coleta finalizada com sucesso!");
        try {
          localStorage.setItem(
            "rastreioOcultoUntil",
            String(Date.now() + 2 * 60 * 1000)
          );
        } catch (e) {}
        setTimeout(() => window.dispatchEvent(new Event("coletaConcluida")), 100);
        setTimeout(() => navigate("/minha-conta"), 2000);
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
        <div className="rastreio-loading">
          <span className="rastreio-spinner" />
          <p>Carregando rastreio...</p>
        </div>
      </div>
    );
  }

  if (!coletaAtiva) {
    setTimeout(() => navigate("/solicitar-coleta", { replace: true }), 500);
    return (
      <div className="rastreio-wrapper">
        <main className="rastreio-container" style={{ textAlign: "center", padding: "50px" }}>
          <h2>Redirecionando...</h2>
          <p>Você não possui uma coleta ativa.</p>
        </main>
      </div>
    );
  }

  const isPendente =
    coletaAtiva.status === "PENDENTE" || coletaAtiva.status === "Pendente";

  return (
    <div className="rastreio-wrapper">
      <main className="rastreio-container">
        <h1 className="rastreio-titulo">
          RASTREAMENTO DA COLETA #{coletaAtiva.id}
        </h1>

        <div className="rastreio-content">

          {/* ── LADO ESQUERDO: cards ──────────────────────────────────── */}
          <div className="rastreio-left">

            {isPendente ? (
              <>
                {/* Card aguardando cooperativa */}
                <div className="r-card r-card--amarelo">
                  <div className="r-card-header">
                    <span className="pulse-dot-yellow" />
                    <span className="r-card-titulo amarelo">Aguardando Cooperativa</span>
                  </div>
                  <h3 className="r-card-h3">Designação de Coletor</h3>
                  <p className="r-card-p">
                    Sua solicitação foi recebida. A cooperativa está
                    selecionando o coletor mais próximo.
                  </p>
                </div>

                {/* Stepper */}
                <div className="r-card">
                  <p className="r-card-subtitulo">ETAPAS DA SOLICITAÇÃO</p>
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
                {/* Card do coletor */}
                <div className="r-card r-card--coletor">
                  <div className="r-rating-pill">⭐ 4.8</div>
                  <div className="r-coletor-header">
                    <div className="r-avatar">
                      <i className="fas fa-user" />
                    </div>
                    <div className="r-coletor-dados">
                      <p className="r-coletor-nome">
                        {coletaAtiva.coletor?.nome || "Carlos Silva"}
                      </p>
                      <p className="r-coletor-veiculo">
                        {coletaAtiva.coletor?.placaVeiculo
                          ? `Van · ${coletaAtiva.coletor.placaVeiculo}`
                          : "Van · ABC-1234"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card de tempo / chegada */}
                <div className="r-card r-card--status">
                  <div className="r-status-header">
                    <i className="fas fa-clock" />
                    <span>
                      {chegou ? "Coletor Chegou!" : "Previsão de Chegada"}
                    </span>
                  </div>

                  {!chegou ? (
                    <>
                      <p className="r-tempo">
                        {tempoRestante != null ? `${tempoRestante} min` : "..."}
                      </p>
                      <p className="r-tempo-sub">O coletor está a caminho</p>
                    </>
                  ) : (
                    <>
                      <p className="r-chegou">Seu coletor chegou! 🎉</p>
                      <p className="r-tempo-sub">Entregue os resíduos ao coletor</p>
                      <button
                        className="r-btn-confirmar"
                        onClick={handleConcluir}
                      >
                        CONFIRMAR COLETA
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Resumo da coleta (sempre visível) */}
            <div className="r-card">
              <p className="r-card-subtitulo">RESUMO DA COLETA</p>

              <div className="r-info-item">
                <span className="r-info-icon">♻️</span>
                <div>
                  <p className="r-info-label">Tipo de Resíduo</p>
                  <p className="r-info-value">{coletaAtiva.tipoResiduo || "Eletrônicos"}</p>
                </div>
              </div>

              <div className="r-info-item">
                <span className="r-info-icon">📍</span>
                <div>
                  <p className="r-info-label">Endereço</p>
                  <p className="r-info-value">
                    {coletaAtiva.endereco || "Endereço cadastrado"}
                  </p>
                </div>
              </div>

              <div className="r-info-item">
                <span className="r-info-icon">📦</span>
                <div>
                  <p className="r-info-label">Status</p>
                  <p className={`r-info-value ${chegou ? "verde" : "azul"}`}>
                    {chegou ? "Coletado ✅" : "Em rota 🚛"}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ── LADO DIREITO: mapa ───────────────────────────────────── */}
          <div className="rastreio-mapa-wrapper">
            <MapaRastreio
              status={coletaAtiva.status}
              onDurationFetched={(s) => setRotaDuracao(s)}
              onProgress={(atual, total) =>
                total > 0 && setRotaProgresso(atual / total)
              }
            />
          </div>

        </div>
      </main>
    </div>
  );
};

export default Rastreio;