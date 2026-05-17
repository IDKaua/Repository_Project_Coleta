import React from 'react';
import './ClienteInfo.css';

function ClienteInfo() {
  return (
    <div className="cliente-card">

      {/* ── Cabeçalho ────────────────────────────────────────────────── */}
      <div className="cliente-card-header">
        <span className="cliente-tag">📋 COLETA DE HOJE</span>
      </div>

      {/* ── Identificação do cliente ──────────────────────────────────── */}
      <div className="cliente-perfil">
        <div className="cliente-avatar">VA</div>
        <div className="cliente-dados">
          <p className="cliente-nome">Vitória Almeida</p>
          <p className="cliente-tipo">Cliente · Pessoa Física</p>
        </div>
        <div className="cliente-status">
          <span className="status-dot" />
          Aguardando
        </div>
      </div>

      {/* ── Endereço ─────────────────────────────────────────────────── */}
      <div className="cliente-info-row">
        <span className="info-icon">📍</span>
        <div>
          <p className="info-label">Endereço</p>
          <p className="info-value">Av. Principal, 123 – Pajuçara, Maceió – AL</p>
        </div>
      </div>

      {/* ── Telefone ─────────────────────────────────────────────────── */}
      <div className="cliente-info-row">
        <span className="info-icon">📞</span>
        <div>
          <p className="info-label">Contato</p>
          <p className="info-value">(82) 99999-0000</p>
        </div>
      </div>

      {/* ── Botão ────────────────────────────────────────────────────── */}
      <button className="btn-ligar">💬 Entrar em contato</button>

    </div>
  );
}

export default ClienteInfo;