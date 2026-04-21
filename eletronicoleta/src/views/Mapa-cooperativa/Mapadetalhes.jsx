const MapaDetalhes = ({ selected }) => (
  <div className="mapa-card mapa-details-card">
    <h3 className="details-title">DETALHES SELECIONADOS</h3>

    {selected ? (
      <>
        <span className="details-badge">
          {selected.tipo === "coleta" ? "Coleta" : "Contêiner"}
        </span>
        <p className="details-name">{selected.label}</p>
        <div className="details-divider" />

        {selected.tipo === "coleta" ? (
          <ul className="details-list">
            <li><span>Status</span><strong>{selected.status}</strong></li>
            <li><span>Motorista</span><strong>{selected.motorista}</strong></li>
            <li><span>Veículo</span><strong>{selected.veiculo}</strong></li>
            <li><span>Início</span><strong>{selected.inicio}</strong></li>
          </ul>
        ) : (
          <ul className="details-list">
            <li><span>Capacidade</span><strong>{selected.capacidade}</strong></li>
            <li><span>Ocupação</span><strong>{selected.ocupacao}</strong></li>
            <li><span>Última Coleta</span><strong>{selected.ultimaColeta}</strong></li>
          </ul>
        )}
      </>
    ) : (
      <div className="details-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
          <circle cx="12" cy="10" r="3"/>
          <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 14 8 14s8-8.75 8-14a8 8 0 0 0-8-8z"/>
        </svg>
        <p>Selecione um item no mapa para ver detalhes</p>
      </div>
    )}
  </div>
);

export default MapaDetalhes;