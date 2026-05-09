import React, { useState, useEffect } from 'react';
import './Coletor.css';
import MapCard from './MapCard/MapCard';
import ClienteInfo from './ClienteInfo/ClienteInfo';
import ColetaDetails from './ColetaDetails/ColetaDetails';

function Coletor() {
  const [minutos, setMinutos] = useState(12);

  // Simulação do tempo descendo
  useEffect(() => {
    if (minutos > 0) {
      const timer = setInterval(() => {
        setMinutos((prev) => prev - 1);
      }, 2000); // Na simulação, 2 segundos valem 1 minuto
      return () => clearInterval(timer);
    }
  }, [minutos]);

  return (
    <div className="coletor-container">
      {/* Título com status dinâmico */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="coletor-title" style={{ margin: 0 }}>RASTREAMENTO DA COLETA</h1>
        <div style={{
          backgroundColor: minutos > 0 ? '#fff8e1' : '#d1fae5',
          color: minutos > 0 ? '#f59e0b' : '#10b981',
          padding: '8px 16px',
          borderRadius: '20px',
          fontWeight: 'bold',
          border: `1px solid ${minutos > 0 ? '#fcd34d' : '#34d399'}`
        }}>
          {minutos > 0 ? `CHEGADA EM ${minutos} MIN` : 'VOCÊ CHEGOU AO DESTINO!'}
        </div>
      </div>
      
      <div className="coletor-content">
        {/* Lado Esquerdo - Mapa */}
        <div style={{ flex: '2' }}>
          <MapCard />
        </div>
        
        {/* Lado Direito - Informações */}
        <div className="coletor-right" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <ClienteInfo />
          <ColetaDetails />
          
          {/* Botão de Finalização adicionado no layout existente */}
          <button 
            disabled={minutos > 0}
            style={{
              padding: '16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: minutos > 0 ? '#e5e7eb' : '#2d8659',
              color: minutos > 0 ? '#9ca3af' : 'white',
              fontWeight: 'bold',
              cursor: minutos > 0 ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              width: '100%',
              marginTop: '10px',
              transition: 'all 0.3s'
            }}
          >
            {minutos > 0 ? 'AGUARDANDO CHEGADA...' : 'INICIAR COLETA'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Coletor;