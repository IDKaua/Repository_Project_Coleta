import React from "react";

const FilaColetas = ({ coletas }) => (
  <section className="painel-card">
    <div className="card-header-tag">
      <i className="fas fa-truck"></i>
      <h3>FILA DE COLETAS A RECEBER</h3>
      <span className="card-badge">Atribuição e Porte</span>
    </div>
    <div className="table-wrapper">
      <table className="painel-table">
        <thead>
          <tr>
            <th>ID Solicitação</th>
            <th>Tipo Equipamento</th>
            <th>Quantidade</th>
            <th>Porte (Triagem)</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {coletas.map((c) => (
            <tr key={c.id}>
              <td><span className="id-badge">{c.id}</span></td>
              <td>{c.tipoEquipamento}</td>
              <td>{c.quantidade}</td>
              <td>
                <span className={`porte-tag porte-${c.porte.toLowerCase()}`}>
                  {c.porte}
                </span>
              </td>
              <td>
                <select className="acao-select">
                  <option>Atribuir Coletor</option>
                  <option>Em andamento</option>
                  <option>Concluído</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default FilaColetas;