import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-container">
        {/* Lado Esquerdo: Logo */}
        <div className="header-logo">
          <i className="fas fa-recycle header-logo-icon"></i>
          <span>ELETRONICOLETA</span>
        </div>

        {/* Lado Direito: Menu + Login */}
        <div className="header-actions">
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
        </div>
      </div>
    </header>
  );
};

export default Header;