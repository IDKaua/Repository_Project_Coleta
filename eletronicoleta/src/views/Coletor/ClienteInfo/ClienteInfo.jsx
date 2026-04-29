import React from 'react';
import './ClienteInfo.css';

function ClienteInfo() {
  return (
    <div className="cliente-card">
      <div className="card-header">
        <span className="user-icon">👤</span>
        <h2 className="card-title">DADOS DO CLIENTE</h2>
      </div>
      
      <div className="cliente-content">
        <div className="cliente-item">
          <div className="avatar">V</div>
          <div className="cliente-text">
            <h3 className="cliente-nome">Vitória Almeida</h3>
            <p className="cliente-endereco">Van • Placa ABC-1234</p>
          </div>
        </div>
        
        <div className="cliente-item phone">
          <span className="phone-icon">📞</span>
          <div className="cliente-text">
            <p className="phone-label">Telefone:</p>
            <p className="phone-number">(27) 99988-1234</p>
          </div>
        </div>
        
        <div className="cliente-item solicitacao">
          <span className="solicitacao-icon">📋</span>
          <p className="solicitacao-text">Solicitação de Coleta</p>
        </div>
      </div>
    </div>
  );
}

export default ClienteInfo;