import React from 'react';
import './ClienteInfo.css';

function ClienteInfo({ coleta, carregando }) {
  if (carregando) {
    return (
      <div className="cliente-card">
        <div className="cliente-card-header">
          <span className="cliente-tag">📋 COLETA DE HOJE</span>
        </div>
        <p className="cliente-carregando">Carregando informações da coleta...</p>
      </div>
    );
  }

  if (!coleta) {
    return (
      <div className="cliente-card">
        <div className="cliente-card-header">
          <span className="cliente-tag">📋 COLETA DE HOJE</span>
        </div>
        <p className="cliente-sem-coleta">Nenhuma coleta atribuída no momento.</p>
      </div>
    );
  }

  const clienteNome = coleta?.morador?.nome || coleta?.nome || 'Cliente';
  const clienteTipo = coleta?.morador?.tipoUsuario === 'MORADOR' ? 'Cliente · Pessoa Física' : 'Cliente';
  const endereco = coleta?.endereco || 'Endereço não informado';
  const telefone = coleta?.morador?.telefone || coleta?.telefone || 'Telefone não informado';
  const status = coleta?.status === 'EM ANDAMENTO' ? 'Em andamento' : coleta?.status || 'Pendente';
  const avatar = clienteNome
    .split(' ')
    .map((parto) => parto[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="cliente-card">
      <div className="cliente-card-header">
        <span className="cliente-tag">📋 COLETA DE HOJE</span>
      </div>

      <div className="cliente-perfil">
        <div className="cliente-avatar">{avatar}</div>
        <div className="cliente-dados">
          <p className="cliente-nome">{clienteNome}</p>
          <p className="cliente-tipo">{clienteTipo}</p>
        </div>
        <div className="cliente-status">
          <span className="status-dot" />
          {status}
        </div>
      </div>

      <div className="cliente-info-row">
        <span className="info-icon">📍</span>
        <div>
          <p className="info-label">Endereço</p>
          <p className="info-value">{endereco}</p>
        </div>
      </div>

      <div className="cliente-info-row">
        <span className="info-icon">📞</span>
        <div>
          <p className="info-label">Contato</p>
          <p className="info-value">{telefone}</p>
        </div>
      </div>

      <a
        className="btn-ligar"
        href={telefone !== 'Telefone não informado' ? `tel:${telefone.replace(/\D/g, '')}` : '#'}
        onClick={(e) => {
          if (telefone === 'Telefone não informado') {
            e.preventDefault();
          }
        }}
      >
        💬 Entrar em contato
      </a>
    </div>
  );
}

export default ClienteInfo;
