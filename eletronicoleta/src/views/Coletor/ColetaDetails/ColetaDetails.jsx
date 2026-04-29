import React from 'react';
import './ColetaDetails.css';

function ColetaDetails() {
  const items = [
    { id: 1, name: 'Computadores', quantity: 2, icon: '💻' },
    { id: 2, name: 'Monitor', quantity: 1, icon: '🖥️' },
    { id: 3, name: '*Eletrônicos / Periféricos**', quantity: null, icon: '⚡' }
  ];

  return (
    <div className="coleta-card">
      <div className="card-header">
        <span className="location-icon">📍</span>
        <h2 className="card-title">IENDERECO DE COLETA</h2>
      </div>
      
      <div className="coleta-content">
        <div className="endereco-item">
          <span className="endereco-pin">📍</span>
          <p className="endereco-texto">Av. Principal, 123, Centro, Vitória - ES</p>
        </div>
        
        <p className="entrada-info">Entrada pelo portão lateral.</p>
      </div>
      
      {/* Itens para Coleta */}
      <div className="coleta-card">
        <div className="card-header">
          <span className="items-icon">📦</span>
          <h2 className="card-title">ITENS PARA COLETA</h2>
        </div>
        
        <div className="items-list">
          {items.map((item) => (
            <div key={item.id} className="item-row">
              <span className="item-icon">{item.icon}</span>
              <span className="item-name">{item.name}</span>
              {item.quantity && (
                <span className="item-quantity">(x{item.quantity})</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ColetaDetails;