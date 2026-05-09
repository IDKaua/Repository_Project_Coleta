import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* COLUNA 1 — Identidade */}
        <div className="footer-col">
          <h4 className="footer-col-titulo">Coluna de Identidade</h4>
          <p className="footer-missao">
            Missão Curta:
            "Inovação tecnológica<br />
            para um futuro sustentável.".
          </p>
          <p className="footer-copyright">© 2026 EcoTec</p>
        </div>

        {/* COLUNA 2 — Suporte e Ações */}
        <div className="footer-col footer-col-center">
          <h4 className="footer-col-titulo">Coluna de Suporte e Ações</h4>

          <ul className="footer-contatos">
            <li>
              <span className="footer-dot azul" />
              ecotech_corporativo@gmail.com
            </li>
            <li>
              <i className="far fa-comment-dots footer-icone-chat" />
              WhatsApp de solicitações: (82) 98877-3322
            </li>
          </ul>

          <button className="footer-btn-b2b">
            Cadastrar Minha Empresa no Programa<br />
            <span>(focado em B2B)</span>
          </button>

          <div className="footer-redes">
            <p className="footer-centralizado">— Centralizado —</p>
            <div className="footer-icons">
              <a href="https://www.instagram.com/flamengo/" aria-label="Instagram"><i className="fab fa-instagram" /></a>
              <a href="https://www.facebook.com/FlamengoOficial/?locale=pt_BR" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a>
              <a href="#" aria-label="Email"><i className="far fa-envelope" /></a>
            </div>
          </div>
        </div>

        {/* COLUNA 3 — Segurança e Jurídico */}
        <div className="footer-col footer-col-right">
          <h4 className="footer-col-titulo">Coluna de Segurança e Jurídico</h4>

          <div className="footer-selo">
            <i className="fas fa-shield-alt footer-shield" />
            <p className="footer-selo-titulo">Selo de Rastreabilidade Digital</p>
            <p className="footer-links-legais">
              <a href="#">Termos de Uso</a>
              <span> | </span>
              <a href="#">Política de Privacidade</a>
            </p>
            <p className="footer-garantia">
              Garantimos a segurança dos dados e o destino final correto dos materiais.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;