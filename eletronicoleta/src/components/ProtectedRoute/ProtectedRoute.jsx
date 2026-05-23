import React from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

const ProtectedRoute = ({ element, requiredUserType = null }) => {
  const getUsuarioSeguro = () => {
    try {
      const user = localStorage.getItem("usuarioLogado");
      if (user && user !== "undefined" && user !== "null") {
        return JSON.parse(user);
      }
    } catch (error) {
      return null;
    }
    return null;
  };

  const usuarioLogado = getUsuarioSeguro();

  // Se não há usuário logado e a rota requer autenticação
  if (!usuarioLogado && requiredUserType) {
    return <Navigate to="/login" replace />;
  }

  // Se há tipo de usuário requerido e o usuário não corresponde
  if (
    requiredUserType &&
    usuarioLogado &&
    usuarioLogado.tipoUsuario !== requiredUserType
  ) {
    // Mostra alerta e redireciona
    Swal.fire({
      icon: "warning",
      title: "Acesso Restrito",
      text: `Esta página é apenas para usuários do tipo ${requiredUserType}. Você está logado como ${usuarioLogado.tipoUsuario}.`,
      confirmButtonText: "Entendi",
      didOpen: () => {
        // Redireciona após mostrar o alerta
        setTimeout(() => {
          window.location.href = "/home";
        }, 2000);
      },
    });
    return null;
  }

  // Se passou em todas as validações, renderiza o elemento
  return element;
};

export default ProtectedRoute;
