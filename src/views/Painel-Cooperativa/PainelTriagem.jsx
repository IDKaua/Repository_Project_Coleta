import React, { useState } from "react";
import "./Paineltriagem.css";

const MATERIAIS = [
  { label: "Cobre",              key: "cobre"             },
  { label: "Alumínio",           key: "aluminio"          },
  { label: "Placas Eletrônicas", key: "placasEletronicas" },
  { label: "Baterias",           key: "baterias"          },
];

const PainelTriagem = ({ coletas }) => {
  const [triagem, setTriagem] = useState({
    loteSelecionado: "",
    tipoMaterial: "Plástico",
    equipamentoId: "",
    cobre: 1, aluminio: 1, placasEletronicas: 1, baterias: 1,
    equipamentoFuncionando: false,
    pecasReutilizaveis: false,
    observacoesTecnicas: "",
    destino: "",
    especificarDestino: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTriagem((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleConfirmar = () => {
    if (!triagem.loteSelecionado || !triagem.destino) {
      alert("Preencha o Lote de Triagem e o Destino antes de confirmar.");
      return;
    }
    alert("Triagem confirmada com sucesso!");
  };

  return (
    <section className="painel-card triagem-card">
      <div className="card-header-tag">
        <i className="fas fa-cogs"></i>
        <h3>GERENCIAMENTO DE TRIAGEM TÉCNICA E DESTINAÇÃO</h3>
      </div>

      {/* Seleção de Componentes */}
      <div className="triagem-section">
        <h4 className="triagem-section-title">
          <i className="fas fa-layer-group"></i> SELEÇÃO DE COMPONENTES
        </h4>
        <div className="triagem-row">
          <div className="triagem-field">
            <label>Lote de Triagem</label>
            <select name="loteSelecionado" value={triagem.loteSelecionado} onChange={handleChange}>
              <option value="">Selecione...</option>
              {coletas.map((c) => (
                <option key={c.id} value={c.id}>{c.id} — {c.tipoEquipamento}</option>
              ))}
            </select>
          </div>
          <div className="triagem-field">
            <label>Tipo Material</label>
            <select name="tipoMaterial" value={triagem.tipoMaterial} onChange={handleChange}>
              <option>Plástico</option>
              <option>Metal</option>
              <option>Vidro</option>
              <option>Borracha</option>
            </select>
          </div>
        </div>

        <div className="triagem-field">
          <label>Equipamento ID</label>
          <input type="text" name="equipamentoId" placeholder="Ex: EQ-00123"
            value={triagem.equipamentoId} onChange={handleChange} />
        </div>

        <div className="materiais-grid">
          {MATERIAIS.map(({ label, key }) => (
            <div key={key} className="material-row">
              <span className="material-label">{label}</span>
              <div className="material-counter">
                <button type="button" onClick={() => setTriagem((p) => ({ ...p, [key]: Math.max(0, p[key] - 1) }))}>−</button>
                <span>{triagem[key]}</span>
                <button type="button" onClick={() => setTriagem((p) => ({ ...p, [key]: p[key] + 1 }))}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Teste de Reaproveitamento */}
      <div className="triagem-section">
        <h4 className="triagem-section-title">
          <i className="fas fa-recycle"></i> TESTE DE REAPROVEITAMENTO
        </h4>
        <div className="checkbox-row">
          <label className="checkbox-label">
            <input type="checkbox" name="equipamentoFuncionando"
              checked={triagem.equipamentoFuncionando} onChange={handleChange} />
            Equipamento Funcionando
          </label>
          <label className="checkbox-label">
            <input type="checkbox" name="pecasReutilizaveis"
              checked={triagem.pecasReutilizaveis} onChange={handleChange} />
            Peças Reutilizáveis
          </label>
        </div>
      </div>

      {/* Desmontagem Técnica */}
      <div className="triagem-section">
        <h4 className="triagem-section-title">
          <i className="fas fa-tools"></i> DESMONTAGEM TÉCNICA
        </h4>
        <textarea name="observacoesTecnicas" placeholder="Observações Técnicas..."
          value={triagem.observacoesTecnicas} onChange={handleChange}
          rows={3} className="triagem-textarea" />
      </div>

      {/* Definição de Destino */}
      <div className="triagem-section">
        <h4 className="triagem-section-title">
          <i className="fas fa-map-pin"></i> DEFINIÇÃO DE DESTINO
        </h4>
        <div className="triagem-row">
          <div className="triagem-field">
            <label>Destino</label>
            <select name="destino" value={triagem.destino} onChange={handleChange}>
              <option value="">Selecione...</option>
              <option>Doação Social</option>
              <option>Recondicionamento</option>
              <option>Reciclagem Indústria</option>
              <option>Reciclagem Industrial</option>
              <option>Indústria Recicladora</option>
              <option>Empresa Especializada</option>
              <option>Empresa Certificada Ambiental</option>
            </select>
          </div>
          <div className="triagem-field">
            <label>Especificar Destino/Parceiro</label>
            <input type="text" name="especificarDestino" placeholder="Nome do parceiro..."
              value={triagem.especificarDestino} onChange={handleChange} />
          </div>
        </div>
      </div>

      <button className="btn-confirmar-triagem" onClick={handleConfirmar}>
        <i className="fas fa-check-circle"></i> Confirmar Triagem
      </button>
    </section>
  );
};

export default PainelTriagem;