import React, { useState, useEffect } from 'react';
import './Coletor.css';
import MapCard from './MapCard/MapCard';
import ClienteInfo from './ClienteInfo/ClienteInfo';
import ColetaDetails from './ColetaDetails/ColetaDetails';

function Coletor() {
  const [coleta, setColeta] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [coletado, setColetado] = useState(false);

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    const buscarColetaAtribuida = async () => {
      if (!usuarioLogado || usuarioLogado.tipoUsuario !== 'COLETOR') {
        setCarregando(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/coletas/coletor/${usuarioLogado.id}/ativos`);

        if (response.ok) {
          const dados = await response.json();
          setColeta(dados?.[0] || null);
        } else {
          setColeta(null);
        }
      } catch (error) {
        console.error('Erro ao buscar coleta do coletor:', error);
        setColeta(null);
      } finally {
        setCarregando(false);
      }
    };

    buscarColetaAtribuida();
  }, []);

  return (
    <div className="coletor-container">
      <h1 className="coletor-title">RASTREAMENTO DA COLETA</h1>

      <div className="coletor-content">
        {/* Lado Esquerdo - 3 Cards */}
        <div className="coletor-left">
          <ClienteInfo coleta={coleta} carregando={carregando} />
          <ColetaDetails coleta={coleta} coletado={coletado} carregando={carregando} />
        </div>

        {/* Lado Direito - Mapa com GPS real + Rota OSRM */}
        <MapCard
          coleta={coleta}
          coletaId={coleta?.id} // <-- ESSA LINHA FALTAVA!
          onChegou={() => setColetado(true)}
          coletado={coletado}
        />
      </div>
    </div>
  );
}

export default Coletor;
