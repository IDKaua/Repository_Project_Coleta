import React from 'react';
import './Rastreio.css';

const Rastreio = () => {
  return (
    <div className="rastreio-wrapper">
      <main className="rastreio-container">
        <h1 className="titulo-sessao">RASTREAMENTO DA COLETA</h1>

        <div className="rastreio-flex-layout">
          {/* LADO ESQUERDO: MAPA */}
          <div className="mapa-secao">
            <div className="mapa-container-high">
              <div className="route-dotted-line"></div>
              
              <div className="pin-marker user-loc">
                <span className="pin-text">Sua Localização</span>
                <div className="pin-dot red-dot"></div>
              </div>
              
              <div className="pin-marker eco-loc">
                <span className="pin-text">Eco Recicla</span>
                <i className="fas fa-building eco-icon"></i>
              </div>

              <div className="moving-truck">
                <i className="fas fa-truck"></i>
              </div>

              <div className="map-zoom-buttons">
                <button>+</button>
                <button>-</button>
              </div>
            </div>
          </div>

          {/* LADO DIREITO: CARDS MODIFICADOS */}
          <div className="cards-secao">
            
            {/* CARD 1: MOTORISTA (COM BOTÃO DE CHAT) */}
<div className="mini-card driver-chat-card">
  
  {/* A estrelinha agora fica solta aqui dentro */}
  <div className="rating-pill">
    <i className="fas fa-star"></i> 4.8
  </div>

  <div className="driver-header">
    <div className="avatar-circle">
      <i className="fas fa-user"></i>
    </div>
    <div className="driver-meta">
      <h3>Carlos Silva</h3>
      {/* Removido daqui de dentro */}
    </div>
  </div>
  <p className="vehicle-text">Van - Placa ABC-1234</p>
  <button className="btn-chat-motorista">
    <i className="fas fa-comment-dots"></i> CONVERSAR
  </button>
</div>

            {/* CARD 2: STATUS (MANTIDO) */}
            <div className="mini-card status-info-card">
              <div className="status-header">
                <i className="fas fa-clock"></i>
                <span>Previsão de Chegada</span>
              </div>
              <h2>15 min</h2>
              <p>O coletor está a caminho</p>
            </div>

            {/* CARD 3: INFORMAÇÕES DA COLETA (SUBSTITUI O PROGRESSO) */}
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

              <div className="info-item">
                <i className="fas fa-weight-hanging"></i>
                <div>
                  <strong>Porte:</strong>
                  <span> Médio</span>
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