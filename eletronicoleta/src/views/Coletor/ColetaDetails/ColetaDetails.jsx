import React from 'react';
import './ColetaDetails.css';

function ColetaDetails({ coletado }) {
  return (
    <div className="coleta-container">

      {/* ── CARD DE INSTRUÇÕES / CHEGADA ──────────────────────────────── */}
      <div className={`coleta-card previsao-card ${coletado ? 'previsao-card--sucesso' : ''}`}>
        <div className="card-header">
          <span className="header-icon">{coletado ? '🎉' : '✓'}</span>
          <h2 className="card-title">
            {coletado ? 'COLETA CONCLUÍDA' : 'INSTRUÇÕES'}
          </h2>
        </div>

        <div className="previsao-content">
          {coletado ? (
            <>
              <p className="sucesso-mensagem">Você coletou a coleta!!</p>
              <p className="sucesso-sub">Ótimo trabalho, Carlos 👏</p>
            </>
          ) : (
            <>
              <p className="status">Coletar até:</p>
              <p className="tempo">12:00</p>
            </>
          )}
        </div>
      </div>

      {/* ── RESUMO DA COLETA ──────────────────────────────────────────── */}
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

        {/* Status da coleta muda conforme coletado */}
        <div className="resumo-item">
          <span className="resumo-icon">{coletado ? '✅' : '🔄'}</span>
          <div className="resumo-content">
            <p className="resumo-label">Status:</p>
            <p className={`resumo-value ${coletado ? 'status-concluido' : 'status-em-rota'}`}>
              {coletado ? 'Coletado' : 'Em rota'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ColetaDetails;