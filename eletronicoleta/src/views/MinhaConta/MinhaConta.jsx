import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import pontosService from "../../services/pontosService";
import "./MinhaConta.css";

import MeuPerfil from "./MeuPerfil";
import MeusEnderecos from "./Meusenderecos";
import HistoricoColetas from "./HistoricoColeta";

const menuItems = [
  { key: "perfil",    label: "Meu Perfil",          icon: "fas fa-user"           },
  { key: "enderecos", label: "Meus Endereços",       icon: "fas fa-map-marker-alt" },
  { key: "historico", label: "Histórico de Coletas", icon: "fas fa-table"          },
];

const MinhaConta = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("perfil");
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  useEffect(() => {
    if (!usuarioLogado) return;

    const verificarColetasFinalizadas = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/coletas/all");
        if (!response.ok) return;

        const coletas = await response.json();
        
        // Filtra coletas que:
        // 1. Estão com status COLETADO
        // 2. Pertencem a este usuário
        // 3. Ainda não foram pontuadas no frontend
        const coletasParaPontuar = coletas.filter(c => 
          c.status === "COLETADO" && 
          c.morador?.id === usuarioLogado.id &&
          !pontosService.jaFoiPontuada(c.id)
        );

        coletasParaPontuar.forEach(coleta => {
          const pontosGanhos = pontosService.creditarPontos(coleta);
          if (pontosGanhos > 0) {
            toast.success(`♻️ Coleta #${coleta.id} concluída! Você ganhou +${pontosGanhos} pontos`, {
              icon: "🌟"
            });
          }
        });
      } catch (error) {
        console.error("Erro ao verificar pontos:", error);
      }
    };

    // Verifica imediatamente ao carregar
    verificarColetasFinalizadas();

    // Polling a cada 15 segundos
    const interval = setInterval(verificarColetasFinalizadas, 15000);

    return () => clearInterval(interval);
  }, [usuarioLogado?.id]);

  const renderContent = () => {
    switch (activeTab) {
      case "perfil":    return <MeuPerfil />;
      case "enderecos": return <MeusEnderecos />;
      case "historico": return <HistoricoColetas />;
      default:          return null;
    }
  };

  return (
    <div className="conta-wrapper">
      <div className="conta-layout">

        {/* Sidebar */}
        <aside className="conta-sidebar">
          <div className="sidebar-logo">
            <i className="fas fa-recycle sidebar-leaf"></i>
            <span className="sidebar-brand">EcoTech</span>
          </div>

          <p className="sidebar-section-label">OPERAÇÕES</p>

          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <button
                key={item.key}
                className={`sidebar-item ${activeTab === item.key ? "active" : ""}`}
                onClick={() => setActiveTab(item.key)}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Conteúdo */}
        <div className="conta-content">
          <div className="conta-breadcrumb">
            <span className="breadcrumb-link" onClick={() => navigate("/home")}>Início</span>
            <i className="fas fa-chevron-right breadcrumb-sep"></i>
            <span className="breadcrumb-current">Minha Conta</span>
          </div>

          <h1 className="conta-titulo">MINHA CONTA</h1>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MinhaConta;