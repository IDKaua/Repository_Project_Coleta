import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  // O Detetive: Verifica se existe alguém logado no localStorage
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  // Função para terminar a sessão
  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/');
  };

  // A MÁGICA DO ROTEAMENTO
  const linkDoPerfil = usuarioLogado?.tipoUsuario === 'COOPERATIVA' 
    ? '/ContaCooperativa' 
    : '/minha-conta';

  return (
    <header className="main-header header-glass">
      <div className="header-container">
        {/* Logótipo */}
        <Link to="/" className="header-logo">
          <div className="logo-container">
            <i className="fas fa-recycle header-logo-icon"></i>
            <span>EcoTech</span>
          </div>
        </Link>

        {/* Menu de Navegação e Ações */}
        <div className="header-actions">
          
          {usuarioLogado ? (
            /* --- ECRÃ DE UTILIZADOR LOGADO --- */
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              
              {/* ÁREA DE PERFIL INTELIGENTE */}
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
                  Olá, {usuarioLogado.nome ? usuarioLogado.nome.split(' ')[0] : 'Utilizador'}
                </span>
              </Link>
              
              {/* Botão de Sair */}
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
            /* --- ECRÃ DE VISITANTE --- */
            <>
              <nav className="header-nav">
                <ul>
                  <li><HashLink smooth to="/">Início</HashLink></li>
                  <li><Link to="#">Serviços</Link></li>
                  <li><Link to="#">Parceiros</Link></li>
                  <li><Link to="#">Funções</Link></li>
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

        </div>
      </div>
    </header>
  );
};

export default Header;