import React from 'react';
import './ColetaDetails.css';

function ColetaDetails({ coleta, coletado, carregando }) {
  if (carregando) {
    return (
      <div className="coleta-container">
        <div className="coleta-card resumo-card">
          <h2 className="resumo-title">RESUMO DA COLETA</h2>
          <p className="coleta-carregando">Carregando dados da coleta...</p>
        </div>
      </div>
    );
  }

  if (!coleta) {
    return (
      <div className="coleta-container">
        <div className="coleta-card resumo-card">
          <h2 className="resumo-title">RESUMO DA COLETA</h2>
          <p className="coleta-sem-coleta">Nenhuma coleta atribuída no momento.</p>
        </div>
      </div>
    );
  }

  const statusLabel = coletado
    ? 'Coletado'
    : coleta.status === 'EM ANDAMENTO'
    ? 'Em rota'
    : coleta.status || 'Pendente';

  return (
    <div className="coleta-container">
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
              <p className="sucesso-sub">Ótimo trabalho!</p>
            </>
          ) : (
            <>
              <p className="status">Coletar até:</p>
              <p className="tempo">12:00</p>
            </>
          )}
        </div>
      </div>

      <div className="coleta-card resumo-card">
        <h2 className="resumo-title">RESUMO DA COLETA</h2>

        <div className="resumo-item">
          <span className="resumo-icon">♻️</span>
          <div className="resumo-content">
            <p className="resumo-label">Itens:</p>
            <p className="resumo-value">{coleta.tipoResiduo || coleta.descricao || 'Resíduos'}</p>
          </div>
        </div>

        <div className="resumo-item">
          <span className="resumo-icon">📍</span>
          <div className="resumo-content">
            <p className="resumo-label">Destino:</p>
            <p className="resumo-value">{coleta.endereco || 'Endereço não informado'}</p>
          </div>
        </div>

        <div className="resumo-item">
          <span className="resumo-icon">📞</span>
          <div className="resumo-content">
            <p className="resumo-label">Contato:</p>
            <p className="resumo-value">{coleta?.morador?.telefone || coleta.telefone || 'Telefone não informado'}</p>
          </div>
        </div>

        <div className="resumo-item">
          <span className="resumo-icon">{coletado ? '✅' : '🔄'}</span>
          <div className="resumo-content">
            <p className="resumo-label">Status:</p>
            <p className={`resumo-value ${coletado ? 'status-concluido' : 'status-em-rota'}`}>
              {statusLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColetaDetails;
