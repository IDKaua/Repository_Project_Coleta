import React from "react";


const menuItems = [
  { label: "Coletas",          view: "coletas", icon: "fas fa-recycle"       },
  { label: "Mapa Operacional", view: "mapa",   icon: "fas fa-map-marked-alt" },
];

const Sidebar = ({ activeView, setActiveView }) => {
  
  return (
    <aside className="painel-sidebar">
      <div className="sidebar-logo">
        <i className="fas fa-recycle sidebar-leaf"></i>
        <span className="sidebar-brand">EcoTech</span>
      </div>

      <p className="sidebar-section-label">OPERAÇÕES</p>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.view}
            className={`sidebar-item ${activeView === item.view ? "active" : ""}`}
            onClick={() => setActiveView(item.view)}
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