import React, { useState } from 'react';
import { CheckCircle2, Truck, XCircle, Download, BarChart3, User, BookText, Mail, Phone, FileText, Building2, Calendar, Pencil } from 'lucide-react';
import './ContaCooperativa.css';

const ContaCooperativa = () => {
  const [activeTab, setActiveTab] = useState('perfil');

  const renderContent = () => {
    switch (activeTab) {
      case 'perfil':
        return (
          <div className="card-content">
            {/* Cabeçalho de Perfil Organizado */}
            <div className="profile-header">
              <div className="profile-avatar-container">
                <div className="profile-avatar-large">🏢</div>
                <button className="link-button-alt">Alterar Foto</button>
              </div>
              <div className="profile-info-text">
                <h2 className="coop-name-institutional">Cooperativa Recicla Vale</h2>
                <p className="coop-email-sub">contato@reciclavale.coop</p>
              </div>
            </div>
            
            <hr className="divider" />
            
            <div className="form-section">

              <h3 className="section-title-black align-left">Dados Cadastrais:</h3>
              
              <div className="input-group">
                <label className="label-input">Telefone:</label>
                <div className="input-wrapper">
                  <input type="text" defaultValue="(11) 91234-5678" />
                  <span className="edit-pencil-icon">✎</span>
                </div>
              </div>
              
              {/* Campo Telefone */}
              <div className="input-group">
                <label className="label-input">Telefone:</label>
                <div className="input-wrapper">
                  <input type="text" defaultValue="(11) 91234-5678" />
                  <span className="edit-pencil-icon">✎</span>
                </div>
              </div>
              <div className="input-group">
                <label className="label-input">CNPJ:</label>
                <div className="input-wrapper">
                  <input type="text" defaultValue="12.345.678/0001-90" />
                  <span className="edit-pencil-icon">✎</span>
                </div>
              </div>
              
             <div className="input-group">
                <label className="label-input">Endereço:</label>
                <div className="input-wrapper">
                  <input type="text" placeholder="Rua, Número, Bairro, Cidade - UF" />
                  <span className="edit-pencil-icon">✎</span>
                </div>
              </div>
            </div>
          </div>
        );

case 'coletas':
case 'coletas':
        const coletasData = [
          { id: 1, data: '03/07/2023', peso: '500kg', status: 'Processado', type: 'success' },
          { id: 2, data: '06/07/2023', peso: '1200kg', status: 'Em Triagem', type: 'pending' },
          { id: 3, data: '03/07/2023', peso: '50kg', status: 'Não Aceito', type: 'error' },
        ];

        return (
          <div className="card-content">
            <h2 className="section-title-coletas">Histórico de Coletas</h2>
            <table className="coletas-table">
              <thead>
                <tr>
                  <th>Data ▾</th>
                  <th>Itens (kg)</th>
                  <th>Status ⇅</th>
                  <th>Comprovante</th>
                </tr>
              </thead>
              <tbody>
                {coletasData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.data}</td>
                    <td>{item.peso}</td>
                    <td>
                      <div className={`status-wrapper ${item.type}`}>
                        {item.type === 'success' && <CheckCircle2 size={18} />}
                        {item.type === 'pending' && <Truck size={18} />}
                        {item.type === 'error' && <XCircle size={18} />}
                        <span>{item.status}</span>
                      </div>
                    </td>
                    <td>
                      <button className="download-btn-formal">
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'dados':
      case 'dados':
        const dadosOperacionais = [
          { label: 'Responsável', value: 'Maria Santos', icon: <User size={20} /> },
          { label: 'E-mail', value: 'maria.santos@reciclavale.coop', icon: <Mail size={20} /> },
          { label: 'Telefone', value: '(11) 91234-5678', icon: <Phone size={20} /> },
          { label: 'CNPJ', value: '12.345.678/0001-90', icon: <FileText size={20} /> },
          { label: 'Registro Municipal', value: '---', icon: <Building2 size={20} /> },
          { label: 'Data de Fundação', value: '---', icon: <Calendar size={20} /> },
        ];

        return (
          <div className="card-content">
            <h2 className="section-title-resumido">DADOS OPERACIONAIS RESUMIDOS</h2>
            <div className="dados-list">
              {dadosOperacionais.map((item, index) => (
                <div key={index} className="dado-row">
                  <div className="dado-info">
                    <span className="dado-icon-formal">{item.icon}</span>
                    <span className="dado-text">
                      <strong>{item.label}:</strong> {item.value}
                    </span>
                  </div>
                  <button className="edit-small-btn">
                    <Pencil size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <div className="page-wrapper">
      <div className="container">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <span className="logo-icon-green">♺</span> 
            <span className="logo-text">EcoTec</span>
          </div>
          <div className="sidebar-content">
            <p className="sidebar-category">OPERAÇÕES</p>
            
            <button className={`nav-item ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => setActiveTab('perfil')}>
              <User size={20} className="formal-icon" /> Perfil da Cooperativa
            </button>
            
            <button className={`nav-item ${activeTab === 'coletas' ? 'active' : ''}`} onClick={() => setActiveTab('coletas')}>
              <BookText size={20} className="formal-icon" /> Histórico de Coletas
            </button>
            
            <button className={`nav-item ${activeTab === 'dados' ? 'active' : ''}`} onClick={() => setActiveTab('dados')}>
              <BarChart3 size={20} className="formal-icon" /> Dados Operacionais
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