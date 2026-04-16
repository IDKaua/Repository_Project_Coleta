import React, { useState } from 'react';
import './ContaCooperativa.css';

const ContaCooperativa = () => {
  const [activeTab, setActiveTab] = useState('perfil');

  const renderContent = () => {
    switch (activeTab) {
      case 'perfil':
        return (
          <div className="card-content">
            <div className="profile-header" style={{ textAlign: 'center' }}>
              <div className="profile-avatar">🏢</div>
              <button className="link-button">Alterar Foto</button>
              <h2 className="coop-name">Cooperativa Recicla Vale</h2>
              <p className="coop-email">contato@reciclavale.coop</p>
            </div>
            <hr className="divider" />
            <div className="form-section">
              <h3 className="section-title">Dados Cadastrais</h3>
              <div className="input-group">
                <label className="label-input">Telefone:</label>
                <div className="input-wrapper">
                  <input type="text" defaultValue="(11) 91234-5678" />
                  <span className="edit-icon">✎</span>
                </div>
              </div>
              <div className="input-group">
                <label className="label-input">CNPJ:</label>
                <div className="input-wrapper">
                  <input type="text" defaultValue="12.345.678/0001-90" />
                  <span className="edit-icon">✎</span>
                </div>
              </div>
              <button className="btn-save" disabled>Salvar Alterações</button>
              <button className="btn-secondary">Adicionar Endereço</button>
            </div>
          </div>
        );

      case 'dados':
        return (
          <div className="card-content">
            <h2 className="section-title-resumido">DADOS OPERACIONAIS RESUMIDOS</h2>
            <div className="dados-list">
              {[
                { label: 'Responsável', value: 'Maria Santos', icon: '👤' },
                { label: 'E-mail', value: 'maria.santos@reciclavale.coop', icon: '✉' },
                { label: 'Telefone', value: '(11) 91234-5678', icon: '📞' },
                { label: 'CNPJ', value: '12.345.678/0001-90', icon: '📄' },
                { label: 'Registro Municipal', value: '', icon: '📋' },
                { label: 'Data de Fundação', value: '', icon: '📅' },
                { label: 'Licença Ambiental', value: '', icon: '⭐' },
                { label: 'Capacidade Mensal (kg)', value: '', icon: '🚛' },
                { label: 'Tipos de Material Aceitos', value: '', icon: '🗺️' },
              ].map((item, index) => (
                <div key={index} className="dado-row">
                  <div className="dado-info">
                    <span className="dado-icon">{item.icon}</span>
                    <span className="dado-text">
                      <strong>{item.label}:</strong> {item.value}
                    </span>
                  </div>
                  <button className="edit-small-btn">✎</button>
                </div>
              ))}
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button className="btn-add-dados">Adicionar Novos Dados</button>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="card-content"><h2>Em breve</h2></div>;
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <span className="logo-icon-green">♻</span> 
            <span className="logo-text">EcoTec</span>
          </div>
          <div className="sidebar-content">
            <p className="sidebar-category">OPERAÇÕES</p>
            <button className={`nav-item ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => setActiveTab('perfil')}>
              <span className="icon">👤</span> Meu Perfil
            </button>
            <button className={`nav-item ${activeTab === 'coletas' ? 'active' : ''}`} onClick={() => setActiveTab('coletas')}>
              <span className="icon">♻</span> Coletas
            </button>
            <button className={`nav-item ${activeTab === 'dados' ? 'active' : ''}`} onClick={() => setActiveTab('dados')}>
              <span className="icon">📊</span> Dados Operacionais
            </button>
          </div>
        </aside>

        <main className="main-content">
          <h1 className="title-page">PAINEL DA COOPERATIVA</h1>
          <div className="main-card">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContaCooperativa;