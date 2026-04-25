import React, { useState, useEffect } from 'react'; // Adicionamos useState e useEffect
import './Rastreio.css';
import MapaRastreio from './MapaRastreio';

const Rastreio = () => {
  // Criamos o estado do tempo começando em 15
  const [tempo, setTempo] = useState(15);

  useEffect(() => {
    // Se o tempo for maior que 0, criamos um cronômetro
    if (tempo > 0) {
      const timer = setInterval(() => {
        setTempo((prevTempo) => prevTempo - 1);
      }, 1500); // 2000ms = 2 segundos para cada minuto (Simulação rápida)

      // Limpa o cronômetro se o componente for fechado
      return () => clearInterval(timer);
    }
  }, [tempo]); // O efeito roda toda vez que o 'tempo' muda

  return (
    <div className="rastreio-wrapper">
      <main className="rastreio-container">
        <h1 className="titulo-sessao">RASTREAMENTO DA COLETA</h1>

        <div className="rastreio-flex-layout">
          <div className="mapa-secao">
            <div className="mapa-container-high">
              <MapaRastreio />
            </div>
          </div>

          <div className="cards-secao">
            {/* CARD 1: MOTORISTA */}
            <div className="mini-card driver-chat-card">
              <div className="rating-pill">
                <i className="fas fa-star"></i> 4.8
              </div>
              <div className="driver-header">
                <div className="avatar-circle">
                  <i className="fas fa-user"></i>
                </div>
                <div className="driver-meta">
                  <h3>Carlos Silva</h3>
                </div>
              </div>
              <p className="vehicle-text">Van - Placa ABC-1234</p>
              <button className="btn-chat-motorista">
                <i className="fas fa-comment-dots"></i> CONVERSAR
              </button>
            </div>

            {/* CARD 2: STATUS (Aqui acontece a mágica do tempo) */}
            <div className="mini-card status-info-card">
              <div className="status-header">
                <i className="fas fa-clock"></i>
                <span>Status da Entrega</span>
              </div>
              
              {/* Lógica condicional: Se o tempo > 0 mostra os minutos, senão mostra a mensagem */}
              {tempo > 0 ? (
                <>
                  <h2 className="tempo-texto">{tempo} min</h2>
                  <p>O coletor está a caminho</p>
                </>
              ) : (
                <>
                  <h2 className="chegou-texto">Seu coletor chegou!</h2>
                  <p>Por favor, dirija-se ao local de coleta.</p>
                </>
              )}
            </div>

            {/* CARD 3: INFORMAÇÕES DA COLETA */}
            <div className="mini-card info-coleta-card">
              <h4 className="card-subtitle">RESUMO DA COLETA</h4>
              <div className="info-item">
                <i className="fas fa-recycle"></i>
                <div>
                  <strong>Itens:</strong>
                  <span> 2x Computadores, 1x Monitor</span>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <strong>Destino:</strong>
                  <span> Av. Principal, 123 - Centro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Rastreio;