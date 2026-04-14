import React, { useState } from 'react';
import './ContaCooperativa.css';

const ContaCooperativa = () => {
  const [activeTab, setActiveTab] = useState('perfil');

  const renderContent = () => {
    switch (activeTab) {
      case 'perfil':
        return (
          <div className="card-content">
            <div className="profile-header">
              <div className="profile-avatar">orate</div>
              <button className="link-button">Alterar Foto</button>
              <h2 className="coop-name">Cooperativa Recicla Vale</h2>
              <p className="coop-email">contato@reciclavale.coop</p>
            </div>
            <hr className="divider" />
            <div className="form-section">
              <h3 className="section-title">Dados Cadastrais</h3>
              <div className="input-group">
                <label>Telefone:</label>
                <div className="input-wrapper">
                  <input type="text" defaultValue="(11) 91234-5678" />
                  <span className="edit-icon">✎</span>
                </div>
              </div>
              <div className="input-group">
                <label>CNPJ:</label>
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
      case 'coletas':
        return (
          <div className="card-content">
            <h3 className="section-title-dark">Histórico de Coletas</h3>
            {/* ... (mesma estrutura de tabela anterior) ... */}
          </div>
        );
      case 'dados':
        return (
          <div className="card-content">
             <h3 className="section-title-dark">DADOS OPERACIONAIS RESUMIDOS</h3>
             {/* ... (mesma estrutura de lista anterior) ... */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="page-wrapper">
      {/* Navbar Superior */}
      <header className="top-navbar">
        <div className="nav-logo">
          <span className="logo-icon">♻</span> EcoTech
        </div>
        <nav className="nav-links">
          <a href="#inicio">Início</a>
          <a href="#servicos">Serviços</a>
          <a href="#parceiros">Parceiros</a>
          <a href="#funcoes">Funções</a>
          <a href="#campanha">Campanha</a>
          <a href="#sobre">Sobre Nós</a>
          <button className="login-btn">👤 Faça Login</button>
        </nav>
      </header>

      <div className="container">
        <aside className="sidebar">
          <button 
            className={`nav-item ${activeTab === 'perfil' ? 'active' : ''}`}
            onClick={() => setActiveTab('perfil')}
          >
            👤 Perfil da Cooperativa
          </button>
          <button 
            className={`nav-item ${activeTab === 'coletas' ? 'active' : ''}`}
            onClick={() => setActiveTab('coletas')}
          >
            📄 Coletas
          </button>
          <button 
            className={`nav-item ${activeTab === 'dados' ? 'active' : ''}`}
            onClick={() => setActiveTab('dados')}
          >
            📊 Dados Operacionais
          </button>
        </aside>

        <main className="main-content">
          <div className="breadcrumb">Início › Painel da Cooperativa</div>
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