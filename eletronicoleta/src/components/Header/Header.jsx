import React from 'react';
import { Link} from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import './Header.css';

const Header = () => {
  return (
    <header className="main-header header-glass">
      <div className="header-container">
        {/* Logo alinhada conforme a imagem */}
        <Link to="/" className="header-logo">
          <div className="logo-container">
            <i className="fas fa-recycle header-logo-icon"></i>
            <span>EcoTech</span>
          </div>
        </Link>

        {/* Menu de Navegação ajustado para: Início, Serviços e Sobre Nós */}
        <div className="header-actions">
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

          {/* Área de Login */}
          <Link to="/login" className="header-login-area">
            <div className="login-icon-box">
              <i className="fas fa-user-circle"></i>
            </div>
            <span className="login-text">Faça Login</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;