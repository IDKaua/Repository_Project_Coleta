import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getUsuarioSeguro = () => {
    try {
      const user = localStorage.getItem("usuarioLogado");

      if (user && user !== "undefined" && user !== "null") {
        return JSON.parse(user);
      }
    } catch (error) {
      console.error("Erro ao ler usuário do localStorage:", error);
      return null;
    }

    return null;
  };

  const [usuarioLogado, setUsuarioLogado] = useState(() => getUsuarioSeguro());
  const [temColetaAtiva, setTemColetaAtiva] = useState(false);

  const verificarColetasAtivas = async (user) => {
    if (!user || user.tipoUsuario !== "MORADOR") {
      setTemColetaAtiva(false);
      return;
    }

    try {
      const ocultoUntil = localStorage.getItem("rastreioOcultoUntil");

      if (ocultoUntil && Date.now() < Number(ocultoUntil)) {
        setTemColetaAtiva(false);
        return;
      }
    } catch (error) {
      console.error("Erro ao verificar flag de rastreio:", error);
    }

    try {
      const response = await fetch("http://localhost:8080/api/coletas/all");

      if (response.ok) {
        const coletas = await response.json();

        const coletaAtiva = coletas.find(
          (c) => c.morador?.id === user.id && c.status !== "COLETADO"
        );

        setTemColetaAtiva(!!coletaAtiva);
      }
    } catch (error) {
      console.error("Erro ao verificar coletas:", error);
    }
  };

  useEffect(() => {
    const handleUpdate = () => {
      const user = getUsuarioSeguro();
      setUsuarioLogado(user);
      verificarColetasAtivas(user);
    };

    const handleColetaSolicitada = () => {
      try {
        localStorage.removeItem("rastreioOcultoUntil");
      } catch (error) {
        console.error("Erro ao remover flag de rastreio:", error);
      }

      const user = getUsuarioSeguro();
      verificarColetasAtivas(user);
    };

    const handleColetaConcluida = () => {
      try {
        localStorage.setItem(
          "rastreioOcultoUntil",
          String(Date.now() + 2 * 60 * 1000)
        );
      } catch (error) {
        console.error("Erro ao salvar flag de rastreio:", error);
      }

      setTemColetaAtiva(false);

      const user = getUsuarioSeguro();
      verificarColetasAtivas(user);
    };

    window.addEventListener("coletaSolicitada", handleColetaSolicitada);
    window.addEventListener("coletaConcluida", handleColetaConcluida);
    window.addEventListener("usuarioAtualizado", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    verificarColetasAtivas(getUsuarioSeguro());

    const interval = setInterval(() => {
      const user = getUsuarioSeguro();

      if (user && user.tipoUsuario === "MORADOR") {
        verificarColetasAtivas(user);
      }
    }, 10000);

    return () => {
      window.removeEventListener("coletaSolicitada", handleColetaSolicitada);
      window.removeEventListener("coletaConcluida", handleColetaConcluida);
      window.removeEventListener("usuarioAtualizado", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const linkDashboard =
    usuarioLogado?.tipoUsuario === "COOPERATIVA"
      ? "/painel-cooperativa"
      : "/minha-conta";

  const linkDoPerfil =
    usuarioLogado?.tipoUsuario === "COOPERATIVA"
      ? "/conta-cooperativa"
      : "/minha-conta";

  useEffect(() => {
    if (
      usuarioLogado &&
      (location.pathname === "/" || location.pathname === "/login")
    ) {
      navigate(linkDashboard, { replace: true });
    }
  }, [usuarioLogado, location.pathname, navigate, linkDashboard]);

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    setUsuarioLogado(null);
    setTemColetaAtiva(false);
    window.dispatchEvent(new Event("usuarioAtualizado"));
    navigate("/login");
  };

  return (
    <header className="main-header header-glass">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <div className="logo-container">
            <i className="fas fa-recycle header-logo-icon"></i>
            <span>EcoTech</span>
          </div>
        </Link>

        <div className="header-actions">
          <nav className="header-nav">
            <ul>
              <li>
                <HashLink smooth to="/home#home">
                  Início
                </HashLink>
              </li>
              <li>
                <HashLink smooth to="/home#servicos">
                  Serviços
                </HashLink>
              </li>
              <li>
                <HashLink smooth to="/home#parceiros">
                  Parceiros
                </HashLink>
              </li>
              <li>
                <HashLink smooth to="/home#funcoes">
                  Funções
                </HashLink>
              </li>
              <li>
                <HashLink smooth to="/home#campanha">
                  Campanha
                </HashLink>
              </li>
              <li>
                <HashLink smooth to="/home#sobre">
                  Sobre Nós
                </HashLink>
              </li>
            </ul>
          </nav>

          {usuarioLogado ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginLeft: "20px",
              }}
            >
              {temColetaAtiva && usuarioLogado?.tipoUsuario === "MORADOR" && (
                <Link
                  to="/rastreio"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#fff",
                    textDecoration: "none",
                    padding: "8px 15px",
                    borderRadius: "6px",
                    transition: "background 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <i className="fas fa-map-location-dot"></i>
                  <span>Rastreio</span>
                </Link>
              )}

              <Link
                to={linkDoPerfil}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#fff",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                {usuarioLogado.foto ? (
                  <img
                    src={usuarioLogado.foto}
                    alt="Perfil"
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <i
                    className="fas fa-user-circle"
                    style={{ fontSize: "28px" }}
                  ></i>
                )}

                <span style={{ fontSize: "1.1rem", fontWeight: "500" }}>
                  Olá, {usuarioLogado.nome ? usuarioLogado.nome.split(" ")[0] : "Usuário"}
                </span>
              </Link>

              <div
                className="header-login-area"
                onClick={handleLogout}
                style={{ cursor: "pointer" }}
              >
                <div className="login-icon-box">
                  <i className="fas fa-sign-out-alt"></i>
                </div>
                <span className="login-text" style={{ color: "#fff" }}>
                  Sair
                </span>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="header-login-area"
              style={{ marginLeft: "20px" }}
            >
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
