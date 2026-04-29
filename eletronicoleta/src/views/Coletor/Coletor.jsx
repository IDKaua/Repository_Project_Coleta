import React from 'react';
import './Coletor.css';
import MapCard from './MapCard/MapCard';
import ClienteInfo from './ClienteInfo/ClienteInfo';
import ColetaDetails from './ColetaDetails/ColetaDetails';
import Instrucoes from './Instrucoes/Instrucoes';

function Coletor() {
  return (
    <div className="coletor-container">
      <h1 className="coletor-title">RASTREAMENTO DA COLETA</h1>
      
      <div className="coletor-content">
        {/* Lado Esquerdo - Mapa */}
        <MapCard />
        
        {/* Lado Direito - Informações */}
        <div className="coletor-right">
          <ClienteInfo />
          <ColetaDetails />
          <Instrucoes />
        </div>
      </div>
    </div>
  );
}

export default Coletor;