import React, { forwardRef } from "react";

// Utilizamos forwardRef para permitir que o pai (PainelCooperativa) 
// controle o scroll até este elemento específico
const FilaColetas = forwardRef(({ coletas, onSelectColeta, onFinalizar }, ref) => (
  <section className="painel-card" ref={ref}>
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
              <td>
                <span className="id-badge">#{c.id}</span>
              </td>
              <td>{c.tipoEquipamento}</td>
              <td>{c.quantidade}</td>
              <td>
                <span className={`porte-tag porte-${c.porte?.toLowerCase()}`}>
                  {c.porte}
                </span>
              </td>
              <td>
                {c.status === "Pendente" ? (
                  <button
                    className="btn-novo"
                    onClick={() => onSelectColeta(c.id)}
                    style={{ background: "#438e44" }}
                  >
                    Atribuir Coletor
                  </button>
                ) : c.status === "Em andamento" ? (
                  <button
                    className="btn-novo"
                    onClick={() => onFinalizar(c.id)}
                    style={{ background: "#f39c12" }}
                  >
                    Finalizar Coleta
                  </button>
                ) : (
                  <span className="porte-tag porte-pequeno" style={{ background: "#2ecc71", color: "#fff" }}>
                    {c.status}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
));

export default FilaColetas;