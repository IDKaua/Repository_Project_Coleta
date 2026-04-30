import React from "react";
import { CheckCircle2, Truck, XCircle, Download } from "lucide-react";

const COLETAS = [
  { id: 1, data: "03/07/2023", peso: "500kg",   status: "Processado", type: "success" },
  { id: 2, data: "06/07/2023", peso: "1200kg",  status: "Em Triagem", type: "pending" },
  { id: 3, data: "03/07/2023", peso: "50kg",    status: "Não Aceito", type: "error"   },
];

const CoopColetas = () => (
  <div className="card-content">
    <h2 className="coop-section-title">Histórico de Coletas</h2>
    <table className="coletas-table">
      <thead>
        <tr>
          <th>Data ▾</th>
          <th>Itens (kg)</th>
          <th>Status</th>
          <th>Comprovante</th>
        </tr>
      </thead>
      <tbody>
        {COLETAS.map((item) => (
          <tr key={item.id}>
            <td>{item.data}</td>
            <td>{item.peso}</td>
            <td>
              <div className={`status-wrapper ${item.type}`}>
                {item.type === "success" && <CheckCircle2 size={16} />}
                {item.type === "pending" && <Truck size={16} />}
                {item.type === "error"   && <XCircle size={16} />}
                <span>{item.status}</span>
              </div>
            </td>
            <td>
              <button className="download-btn-formal">
                <Download size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CoopColetas;