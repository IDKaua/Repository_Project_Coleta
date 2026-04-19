import React from "react";

const HISTORICO = [
  { data: "03/07/2023", itens: "1 Itens", status: "Entregue",    pontos: "1.250 PTS", icone: "fas fa-check-circle",  cor: "status-entregue"  },
  { data: "06/07/2023", itens: "1 Itens", status: "Em Trânsito", pontos: "20 PTS",    icone: "fas fa-truck",         cor: "status-transito"  },
  { data: "03/07/2023", itens: "1 Itens", status: "Cancelado",   pontos: "5 PTS",     icone: "fas fa-times",         cor: "status-cancelado" },
  { data: "06/07/2023", itens: "1 Itens", status: "Cancelado",   pontos: "5 PTS",     icone: "fas fa-times",         cor: "status-cancelado" },
  { data: "03/07/2023", itens: "1 Itens", status: "Entregue",    pontos: "3 PTS",     icone: "fas fa-check-circle",  cor: "status-entregue"  },
  { data: "03/07/2023", itens: "1 Itens", status: "Entregue",    pontos: "1.250 PTS", icone: "fas fa-check-circle",  cor: "status-entregue"  },
  { data: "03/07/2023", itens: "1 Itens", status: "Cancelado",   pontos: "10 PTS",    icone: "fas fa-times",         cor: "status-cancelado" },
  { data: "06/07/2023", itens: "1 Itens", status: "Em Trânsito", pontos: "3 PTS",     icone: "fas fa-truck",         cor: "status-transito"  },
  { data: "03/07/2023", itens: "1 Itens", status: "Entregue",    pontos: "1.250 PTS", icone: "fas fa-check-circle",  cor: "status-entregue"  },
  { data: "06/07/2023", itens: "1 Itens", status: "Cancelado",   pontos: "5 PTS",     icone: "fas fa-times-circle",  cor: "status-cancelado" },
  { data: "03/07/2023", itens: "1 Itens", status: "Cancelado",   pontos: "5 PTS",     icone: "fas fa-times",         cor: "status-cancelado" },
];

const HistoricoColetas = () => (
  <div className="conta-card historico-card">
    <h3 className="dados-titulo">Histórico de Coletas</h3>

    <div className="table-wrapper">
      <table className="historico-table">
        <thead>
          <tr>
            <th>Data <i className="fas fa-sort-down"></i></th>
            <th>Itens</th>
            <th>Status <i className="fas fa-sort"></i></th>
            <th>Pontos</th>
          </tr>
        </thead>
        <tbody>
          {HISTORICO.map((row, i) => (
            <tr key={i}>
              <td>{row.data}</td>
              <td>| {row.itens}</td>
              <td>
                <span className={`status-badge ${row.cor}`}>
                  <i className={row.icone}></i> {row.status}
                </span>
              </td>
              <td className="pontos-col">{row.pontos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default HistoricoColetas;