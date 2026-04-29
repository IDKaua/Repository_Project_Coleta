import React from 'react';
import './ClienteInfo.css';

function ClienteInfo() {
  return (
    <div className="cliente-card">
      <div className="coletor-header">
        <div className="avatar">C</div>
        <div className="coletor-info">
          <h2 className="coletor-nome">Carlos Silva</h2>
          <p className="coletor-veiculo">Van - Placa ABC-1234</p>
        </div>
        <div className="rating">
          <span className="star">⭐</span>
          <span className="rating-value">4.8</span>
        </div>
      </div>

      <button className="btn-conversar">💬 CONVERSAR</button>
    </div>
  );
}

export default ClienteInfo;