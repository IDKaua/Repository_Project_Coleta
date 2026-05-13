import React, { useState } from "react";
import { User, BookText, BarChart3 } from "lucide-react";
import "./ContaCooperativa.css";

import CoopPerfil  from "./CoopPerfil";
import CoopColetas from "./CoopColetas";
import CoopDados   from "./CoopDados";

const MENU = [
  { key: "perfil",  label: "Perfil da Cooperativa",  Icon: User      },
  { key: "coletas", label: "Histórico de Coletas",    Icon: BookText  },
  { key: "dados",   label: "Dados Operacionais",      Icon: BarChart3 },
];

const ContaCooperativa = () => {
  const [activeTab, setActiveTab] = useState("perfil");

  const renderContent = () => {
    switch (activeTab) {
      case "perfil":  return <CoopPerfil />;
      case "coletas": return <CoopColetas />;
      case "dados":   return <CoopDados />;
      default:        return null;
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">

        <aside className="sidebar">
          <div className="sidebar-logo">
            <span className="logo-icon-green">♺</span>
            <span className="logo-text">EcoTec</span>
          </div>
          <div className="sidebar-content">
            <p className="sidebar-category">OPERAÇÕES</p>
            {MENU.map(({ key, label, Icon }) => (
              <button
                key={key}
                className={`nav-item ${activeTab === key ? "active" : ""}`}
                onClick={() => setActiveTab(key)}
              >
                <Icon size={18} className="formal-icon" /> {label}
              </button>
            ))}
          </div>
        </aside>

        <main className="main-content">
          <h1 className="title-page">PAINEL DA COOPERATIVA</h1>
          <div className="main-card">{renderContent()}</div>
        </main>

      </div>
    </div>
  );
};

export default ContaCooperativa;