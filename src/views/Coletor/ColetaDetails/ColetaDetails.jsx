import React from 'react';
import './ColetaDetails.css';

function ColetaDetails() {
  return (
    <div className="coleta-container">
      {/* PREVISÃO DE CHEGADA */}
      <div className="coleta-card previsao-card">
        <div className="card-header">
          <span className="header-icon">✓</span>
          <h2 className="card-title">INSTRUÇÕES</h2>
        </div>
        
        <div className="previsao-content">
          <p className="status">Coletar até:</p>
          <p className="tempo">12:00</p>
        </div>
      </div>

      {/* RESUMO DA COLETA */}
      <div className="coleta-card resumo-card">
        <h2 className="resumo-title">RESUMO DA COLETA</h2>
        
        <div className="resumo-item">
          <span className="resumo-icon">♻️</span>
          <div className="resumo-content">
            <p className="resumo-label">Items:</p>
            <p className="resumo-value">2x Computadores, 1x Monitor</p>
          </div>
        </div>

        <div className="resumo-item">
          <span className="resumo-icon">📍</span>
          <div className="resumo-content">
            <p className="resumo-label">Destino:</p>
            <p className="resumo-value">Av. Principal, 123 - Centro</p>
          </div>
        </div>

        <div className="resumo-item">
          <span className="resumo-icon">📦</span>
          <div className="resumo-content">
            <p className="resumo-label">Porte:</p>
            <p className="resumo-value">Médio</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColetaDetails;