import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Rastreio.css";
import MapaRastreio from "./MapaRastreio";

const Rastreio = () => {
  const navigate = useNavigate();
  const [coletaAtiva, setColetaAtiva] = useState(null);
  const [carregando, setCarregando]   = useState(true);

  // Duração e distância INICIAL da rota (vinda do OSRM no primeiro cálculo)
  const [duracaoInicial,  setDuracaoInicial]  = useState(null);
  const [distanciaInicial,setDistanciaInicial]= useState(null);

  // Valores RESTANTES atualizados a cada movimento do coletor
  const [duracaoRestante,  setDuracaoRestante]  = useState(null);
  const [distanciaRestante,setDistanciaRestante]= useState(null);

  // Chegada: só vira true quando MapaRastreio chama onChegou
  const [chegou, setChegou] = useState(false);

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

  // Chamado uma vez quando a rota inicial é calculada
  const handleDurationFetched = (segundos, metros) => {
    setDuracaoInicial(segundos);
    setDistanciaInicial(metros);
    setDuracaoRestante(segundos);
    setDistanciaRestante(metros);
  };

  // Chamado a cada atualização de posição do coletor
  // onProgress(segundos_restantes, metros_restantes)
  const handleProgress = (segundos, metros) => {
    setDuracaoRestante(segundos);
    setDistanciaRestante(metros);
  };

  // Chamado somente quando o caminhão realmente chegou (dentro do raio de 60m)
  const handleChegou = () => {
    setChegou(true);
    setDuracaoRestante(0);
    setDistanciaRestante(0);
  };

  // Tempo em minutos para exibição
  const tempoMin =
    duracaoRestante != null
      ? Math.max(0, Math.round(duracaoRestante / 60))
      : null;

  // Distância em km ou metros
  const distLabel =
    distanciaRestante != null
      ? distanciaRestante >= 1000
        ? `${(distanciaRestante / 1000).toFixed(1)} km`
        : `${Math.round(distanciaRestante)} m`
      : null;

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

          {/* ── ESQUERDA: cards ─────────────────────────────────────── */}
          <div className="rastreio-left">

            {isPendente ? (
              <>
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
                {/* Card coletor */}
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

                {/* Card tempo — aguarda rota antes de mostrar qualquer coisa */}
                <div className="r-card r-card--status">
                  <div className="r-status-header">
                    <i className="fas fa-clock" />
                    <span>{chegou ? "Coletor Chegou!" : "Previsão de Chegada"}</span>
                  </div>

                  {chegou ? (
                    /* ── CHEGADA ── */
                    <>
                      <p className="r-chegou">Seu coletor chegou! 🎉</p>
                      <p className="r-tempo-sub">Entregue os resíduos ao coletor</p>
                      <button className="r-btn-confirmar" onClick={handleConcluir}>
                        CONFIRMAR COLETA
                      </button>
                    </>
                  ) : duracaoRestante === null ? (
                    /* ── AGUARDANDO ROTA ── mostra "..." até OSRM responder */
                    <>
                      <p className="r-tempo">...</p>
                      <p className="r-tempo-sub">Calculando rota…</p>
                    </>
                  ) : (
                    /* ── EM ROTA ── */
                    <>
                      <p className="r-tempo">{tempoMin} min</p>
                      {distLabel && (
                        <p className="r-tempo-dist">{distLabel} restantes</p>
                      )}
                      <p className="r-tempo-sub">O coletor está a caminho</p>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Resumo */}
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

          {/* ── DIREITA: mapa ────────────────────────────────────────── */}
          <div className="rastreio-mapa-wrapper">
            <MapaRastreio
              coletaId={coletaAtiva.id}
              status={coletaAtiva.status}
              onDurationFetched={handleDurationFetched}
              onProgress={handleProgress}
              onChegou={handleChegou}
            />
          </div>

        </div>
      </main>
    </div>
  );
};

export default Rastreio;