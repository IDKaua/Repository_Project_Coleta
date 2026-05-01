<<<<<<< HEAD
import React, { useEffect } from 'react';
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

  const usuarioLogado = getUsuarioSeguro();

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

=======
import React from 'react';
import './Header.css';

const Header = () => {
>>>>>>> parent of 99633f7 (Alteração - Kauã)
  return (
    <header className="main-header">
      <div className="header-container">
<<<<<<< HEAD
        
        {/* Logo Original */}
        <Link to="/" className="header-logo">
          <div className="logo-container">
            <i className="fas fa-recycle header-logo-icon"></i>
            <span>EcoTech</span>
          </div>
        </Link>
=======
        {/* Lado Esquerdo: Logo */}
        <div className="header-logo">
          <i className="fas fa-recycle header-logo-icon"></i>
          <span>ELETRONICOLETA</span>
        </div>
>>>>>>> parent of 99633f7 (Alteração - Kauã)

        {/* Lado Direito: Menu + Login */}
        <div className="header-actions">
<<<<<<< HEAD
          
          {usuarioLogado ? (
            /* --- TELA LOGADA (Aparece apenas lá nos painéis) --- */
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              
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
                <i className="fas fa-user-circle" style={{ fontSize: '28px' }}></i>
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

            /* --- TELA SEM LOGIN (Menu Intacto na Home) --- */
            <>
              <nav className="header-nav">
                <ul>
                  <li><HashLink smooth to="/">Início</HashLink></li>
                  <li><Link to="#">Serviços</Link></li>
                  <li><Link to="#">Parceiros</Link></li>
                  <li><Link to="#">Funçoes</Link></li>
                  <li><HashLink smooth to="/#campanha">Campanha</HashLink></li>
                  <li><Link to="/sobre">Sobre Nós</Link></li>
                </ul>
              </nav>

              <Link to="/login" className="header-login-area">
                <div className="login-icon-box">
                  <i className="fas fa-user-circle"></i>
                </div>
                <span className="login-text">Faça Login</span>
              </Link>
            </>
            
          )}

=======
          <nav className="header-nav">
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#funcoes">Funções</a></li>
              <li><a href="#sobre">Sobre</a></li>
              <li><a href="#fale-conosco">Fale Conosco</a></li>
            </ul>
          </nav>

          {/* NOVO BLOCO DE LOGIN: Clicável para a tela de login */}
          {/* Se usar rotas, mude <a> por <Link to="/login"> */}
          <a href="/login" className="header-login-area">
            <div className="login-icon-box">
              <i className="fas fa-user-circle"></i> {/* Ícone de usuário redondo */}
            </div>
            <span className="login-text">Faça Login</span>
          </a>
>>>>>>> parent of 99633f7 (Alteração - Kauã)
        </div>
      </div>
    </header>
  );
};

export default Header;