import React, { useState } from 'react';
import './Coletor.css';
import MapCard from './MapCard/MapCard';
import ClienteInfo from './ClienteInfo/ClienteInfo';
import ColetaDetails from './ColetaDetails/ColetaDetails';

function Coletor() {
  // Estado global: motorista chegou ao cliente?
  const [coletado, setColetado] = useState(false);

  return (
    <div className="coletor-container">
      <h1 className="coletor-title">RASTREAMENTO DA COLETA</h1>

      <div className="coletor-content">
        {/* Lado Esquerdo - 3 Cards */}
        <div className="coletor-left">
          <ClienteInfo />
          <ColetaDetails coletado={coletado} />
        </div>

        {/* Lado Direito - Mapa com GPS real + Rota OSRM */}
        <MapCard
          onChegou={() => setColetado(true)}
          coletado={coletado}
        />
      </div>
    </div>
  );
}

export default Coletor;