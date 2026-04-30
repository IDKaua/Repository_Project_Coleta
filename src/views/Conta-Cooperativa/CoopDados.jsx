import React from "react";
import { User, Mail, Phone, FileText, Pencil } from "lucide-react";

const DADOS = [
  { label: "Responsável", value: "Maria Santos",               icon: <User size={18} />     },
  { label: "E-mail",      value: "maria.santos@reciclavale.coop", icon: <Mail size={18} />  },
  { label: "Telefone",    value: "(11) 91234-5678",            icon: <Phone size={18} />    },
  { label: "CNPJ",        value: "12.345.678/0001-90",         icon: <FileText size={18} /> },
];

const CoopDados = () => (
  <div className="card-content">
    <h2 className="coop-section-title">DADOS OPERACIONAIS RESUMIDOS</h2>
    <div className="dados-list">
      {DADOS.map((item, i) => (
        <div key={i} className="dado-row">
          <div className="dado-info">
            <span className="dado-icon-formal">{item.icon}</span>
            <span className="dado-text">
              <strong>{item.label}:</strong> {item.value}
            </span>
          </div>
          <button className="edit-small-btn" title="Editar">
            <Pencil size={15} />
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default CoopDados;