import React from 'react';
import './Instrucoes.css';

function Instrucoes() {
  const instrucoes = [
    {
      icon: '🕐',
      label: 'Horário:',
      valor: 'Coletar até 12.00h'
    },
    {
      icon: '⚠️',
      label: 'Cuidado:',
      valor: 'Itens delicados'
    }
  ];

  return (
    <div className="instrucoes-card">
      <div className="card-header">
        <span className="warning-icon">⚠️</span>
        <h2 className="card-title">INSTRUÇÕES ESPECIAIS</h2>
      </div>
      
      <div className="instrucoes-list">
        {instrucoes.map((instr, idx) => (
          <div key={idx} className="instrucao-item">
            <span className="instr-icon">{instr.icon}</span>
            <div className="instr-content">
              <span className="instr-label">{instr.label}</span>
              <p className="instr-valor">{instr.valor}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Instrucoes;