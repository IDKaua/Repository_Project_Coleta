import React from "react";
import Swal from "sweetalert2";
import "./ServiceCard.css";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ tipo, icone, desc, onClick }) => {
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  const handleAccess = () => {
    // Se um onClick customizado foi passado, usar ele primeiro
    if (onClick) {
      onClick();
      return;
    }

    if (tipo === "USUÁRIO") {
      navigate("/solicitar-coleta");
    } else if (tipo === "COOPERATIVA") {
      // Verifica se o usuário está logado como COOPERATIVA
      if (usuarioLogado && usuarioLogado.tipoUsuario === "COOPERATIVA") {
        navigate("/painel-cooperativa");
      } else if (usuarioLogado) {
        // Se está logado como outro tipo, mostra aviso
        Swal.fire({
          icon: "warning",
          title: "Acesso Restrito",
          text:
            "Você está logado como " +
            usuarioLogado.tipoUsuario.toLowerCase() +
            ". Para acessar o painel da cooperativa, faça login com sua conta de cooperativa.",
          confirmButtonText: "Fazer Login",
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          }
        });
      } else {
        // Não está logado
        navigate("/login");
      }
    } else if (tipo === "COLETOR") {
      // Verifica se o usuário está logado como COLETOR
      if (usuarioLogado && usuarioLogado.tipoUsuario === "COLETOR") {
        navigate("/coletor");
      } else if (usuarioLogado) {
        Swal.fire({
          icon: "warning",
          title: "Acesso Restrito",
          text:
            "Você está logado como " +
            usuarioLogado.tipoUsuario.toLowerCase() +
            ". Para acessar o painel do coletor, faça login com sua conta de coletor.",
          confirmButtonText: "Fazer Login",
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/login", { state: { type: "coletor" } });
          }
        });
      } else {
        navigate("/login", { state: { type: "coletor" } });
      }
    }
  };

  return (
    <div className="service-card">
      <div className="card-icon-box">
        <i className={`fas ${icone}`}></i>
      </div>
      <h3>{tipo}</h3>
      <p>{desc}</p>
      <button onClick={handleAccess} className="btn-acessar">
        ACESSAR
      </button>
    </div>
  );
};

export default ServiceCard;
