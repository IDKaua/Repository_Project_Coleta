import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lê o login de forma segura
  const getUsuarioSeguro = () => {
    try {
      const user = localStorage.getItem('usuarioLogado');
      if (user && user !== 'undefined' && user !== 'null') {
        return JSON.parse(user);
      }
    } catch (error) {
      return null;
    }
    return null;
  };

  const [usuarioLogado, setUsuarioLogado] = useState(() => getUsuarioSeguro());

  useEffect(() => {
    const handleUpdate = () => setUsuarioLogado(getUsuarioSeguro());
    window.addEventListener('usuarioAtualizado', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('usuarioAtualizado', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // 1. Rota para o Painel (Dashboard)
  const linkDashboard = usuarioLogado?.tipoUsuario === 'COOPERATIVA' 
    ? '/painel-cooperativa' 
    : '/solicitar-coleta'; 

  // 2. Rota para os Dados da Conta (Perfil)
  const linkDoPerfil = usuarioLogado?.tipoUsuario === 'COOPERATIVA' 
    ? '/conta-cooperativa' // <-- Coloquei com C maiúsculo como você tinha me dito antes!
    : '/minha-conta';    

  // ====================================================================
  // A MÁGICA DO REDIRECIONAMENTO AUTOMÁTICO (Agora usa linkDashboard)
  // ====================================================================
  useEffect(() => {
    if (usuarioLogado && (location.pathname === '/' || location.pathname === '/login')) {
      navigate(linkDashboard, { replace: true }); 
    }
  }, [usuarioLogado, location.pathname, navigate, linkDashboard]);

  // Função para deslogar
  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/');
  };

  return (
    <header className="main-header header-glass">
      <div className="header-container">
        
        {/* Logo Original */}
        <Link to="/" className="header-logo">
          <div className="logo-container">
            <i className="fas fa-recycle header-logo-icon"></i>
            <span>EcoTech</span>
          </div>
        </Link>

        {/* Menu de Navegação e Ações */}
        <div className="header-actions">
          
          {/* --- TELA SEM LOGIN E COM LOGIN (Menu Intacto) --- */}
          <nav className="header-nav">
            <ul>
              <li><HashLink smooth to="/home#home">Início</HashLink></li>
              <li><HashLink smooth to="/home#servicos">Serviços</HashLink></li>
              <li><HashLink smooth to="/home#parceiros">Parceiros</HashLink></li>
              <li><HashLink smooth to="/home#funcoes">Funções</HashLink></li>
              <li><HashLink smooth to="/home#campanha">Campanha</HashLink></li>
              <li><HashLink smooth to="/home#sobre">Sobre Nós</HashLink></li>
            </ul>
          </nav>

          {usuarioLogado ? (
            /* --- TELA LOGADA --- */
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginLeft: '20px' }}>
              
              {/* O CLIQUE DO USUÁRIO (Agora usa linkDoPerfil) */}
              <Link 
                to={linkDoPerfil} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  color: '#fff', 
                  textDecoration: 'none',
                  cursor: 'pointer' 
                }}
              >
                {usuarioLogado.foto ? (
                  <img src={usuarioLogado.foto} alt="Perfil" style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <i className="fas fa-user-circle" style={{ fontSize: '28px' }}></i>
                )}
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                  Olá, {usuarioLogado.nome ? usuarioLogado.nome.split(' ')[0] : 'Usuário'}
                </span>
              </Link>
              
              <div 
                className="header-login-area" 
                onClick={handleLogout}
                style={{ cursor: 'pointer' }}
              >
                <div className="login-icon-box">
                  <i className="fas fa-sign-out-alt"></i>
                </div>
                <span className="login-text" style={{ color: '#fff' }}>Sair</span>
              </div>
            </div>

          ) : (

            /* --- TELA SEM LOGIN (Botão de Login) --- */
            <Link to="/login" className="header-login-area" style={{ marginLeft: '20px' }}>
              <div className="login-icon-box">
                <i className="fas fa-user-circle"></i>
              </div>
              <span className="login-text">Faça Login</span>
            </Link>
            
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;