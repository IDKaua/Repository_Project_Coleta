import React from 'react';
import './MapCard.css';

function MapCard() {
  return (
    <div className="map-card">
      {/* Simulação do Mapa */}
      <svg viewBox="0 0 400 500" className="map-svg">
        {/* Background do mapa */}
        <rect width="400" height="500" fill="#e8e8e8" />
        
        {/* Linhas de ruas */}
        <line x1="0" y1="80" x2="400" y2="80" stroke="#d0d0d0" strokeWidth="8" />
        <line x1="0" y1="160" x2="400" y2="160" stroke="#d0d0d0" strokeWidth="8" />
        <line x1="0" y1="240" x2="400" y2="240" stroke="#d0d0d0" strokeWidth="8" />
        <line x1="0" y1="320" x2="400" y2="320" stroke="#d0d0d0" strokeWidth="8" />
        <line x1="0" y1="400" x2="400" y2="400" stroke="#d0d0d0" strokeWidth="8" />
        
        <line x1="100" y1="0" x2="100" y2="500" stroke="#d0d0d0" strokeWidth="6" />
        <line x1="200" y1="0" x2="200" y2="500" stroke="#d0d0d0" strokeWidth="6" />
        <line x1="300" y1="0" x2="300" y2="500" stroke="#d0d0d0" strokeWidth="6" />
        
        {/* Rio/Verde */}
        <path d="M 20 100 Q 30 200 40 400" stroke="#90d490" strokeWidth="25" fill="none" />
        
        {/* Quadras do mapa */}
        <rect x="30" y="20" width="50" height="40" fill="#f0f0f0" stroke="#999" strokeWidth="1" />
        <rect x="30" y="100" width="50" height="50" fill="#f0f0f0" stroke="#999" strokeWidth="1" />
        <rect x="120" y="30" width="60" height="45" fill="#f0f0f0" stroke="#999" strokeWidth="1" />
        <rect x="120" y="110" width="60" height="50" fill="#f0f0f0" stroke="#999" strokeWidth="1" />
        <rect x="220" y="50" width="55" height="40" fill="#f0f0f0" stroke="#999" strokeWidth="1" />
        <rect x="220" y="130" width="55" height="50" fill="#f0f0f0" stroke="#999" strokeWidth="1" />
        <rect x="310" y="40" width="50" height="50" fill="#f0f0f0" stroke="#999" strokeWidth="1" />
        
        {/* Caminhão (rota) */}
        <line x1="60" y1="250" x2="280" y2="280" stroke="#4a90e2" strokeWidth="8" />
        <circle cx="60" cy="250" r="22" fill="#4a90e2" />
        <circle cx="80" cy="255" r="8" fill="#fff" />
        <rect x="65" y="240" width="30" height="15" fill="#4a90e2" />
        
        {/* Marcador de localização */}
        <g className="location-pin">
          <circle cx="120" cy="160" r="18" fill="#2d8659" />
          <circle cx="120" cy="160" r="12" fill="#fff" />
          <path d="M 120 155 L 125 165 L 115 165 Z" fill="#2d8659" />
        </g>
        
        {/* Label do endereço */}
        <g className="label-box">
          <rect x="30" y="190" width="160" height="50" fill="#2d8659" rx="6" />
          <circle cx="45" cy="210" r="8" fill="#fff" />
          <text x="60" y="217" fontSize="14" fill="#fff" fontWeight="bold">Vitória Almeida</text>
          <text x="60" y="232" fontSize="12" fill="#fff">Av. Principal, 123</text>
        </g>
      </svg>
      
      {/* Controles do mapa */}
      <div className="map-controls">
        <button className="control-btn compass">
          <span className="compass-icon">🧭</span>
        </button>
        <button className="control-btn zoom-in">+</button>
        <button className="control-btn zoom-out">−</button>
      </div>
    </div>
  );
}

export default MapCard;