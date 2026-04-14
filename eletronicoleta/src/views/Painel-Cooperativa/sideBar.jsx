import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Coletas",          path: "/painel-cooperativa", icon: "fas fa-recycle"       },
  { label: "Mapa Operacional", path: "/mapa-cooperativa",   icon: "fas fa-map-marked-alt" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="painel-sidebar">
      <div className="sidebar-logo">
        <i className="fas fa-recycle sidebar-leaf"></i>
        <span className="sidebar-brand">EcoTec</span>
      </div>

      <p className="sidebar-section-label">OPERAÇÕES</p>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;