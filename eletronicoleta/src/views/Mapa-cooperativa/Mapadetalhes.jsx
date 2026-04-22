const MapaDetalhes = ({ selected }) => (
  <div className="mapa-card mapa-details-card">
    <h3 className="details-title">INFORMAÇÕES DO ATIVO</h3>

    {selected ? (
      <>
        <span className={`details-badge ${selected.tipo}`}>
          {selected.tipo === "coleta" ? "Caminhão" : "Ponto de Coleta"}
        </span>
        <p className="details-name">{selected.label}</p>
        
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>
          📍 {selected.tipo === "coleta" ? `Destino: ${selected.destino}` : `Local: ${selected.endereco}`}
        </p>

        <div className="details-divider" />

        {selected.tipo === "coleta" ? (
          <ul className="details-list">
            <li><span>Motorista</span><strong>{selected.motorista}</strong></li>
            <li><span>Veículo</span><strong>{selected.veiculo}</strong></li>
            <li><span>Status</span><strong style={{color: '#2d6a2d'}}>{selected.status}</strong></li>
            <li><span>Início da Rota</span><strong>{selected.inicio}</strong></li>
          </ul>
        ) : (
          <ul className="details-list">
            <li><span>Capacidade</span><strong>{selected.capacidade}</strong></li>
            <li><span>Nível de Carga</span><strong style={{color: parseInt(selected.ocupacao) > 80 ? 'red' : 'inherit'}}>{selected.ocupacao}</strong></li>
            <li><span>Última Visita</span><strong>{selected.ultimaColeta}</strong></li>
          </ul>
        )}
      </>
    ) : (
      <div className="details-empty">
        <p>Toque em um ícone no mapa para ver o status detalhado e o endereço.</p>
      </div>
    )}
  </div>
);

export default MapaDetalhes;