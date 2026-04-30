import React from "react";

const InfoLixo = ({ formData, setFormData, handleChange }) => {
  const selecionarPorte = (tamanho) => {
    setFormData((prev) => ({ ...prev, porte: tamanho }));
  };

  return (
    <section className="coleta-card card-info-lixo">
      <h3>Informações do Lixo</h3>

      <div className="info-lixo-row">
        {/* Tipo */}
        <div className="input-item tipo-equipamento">
          <label><i className="fas fa-desktop"></i> Tipo de Equipamento</label>
          <select name="tipo_residuo" value={formData.tipo_residuo} onChange={handleChange}>
            <option value="Computadores">🖥️ Computadores</option>
            <option value="Celulares">📱 Celulares</option>
            <option value="Perifericos">⌨️ Periféricos</option>
            <option value="Eletrodomesticos">🎰 Eletrodomésticos</option>
          </select>
        </div>

        {/* Quantidade */}
        <div className="input-item quantidade-box">
          <label><i className="fas fa-cube"></i> Quantidade Aproximada</label>
          <div className="contador-container">
            <button
              type="button"
              className="btn-counter"
              onClick={() => setFormData((p) => ({ ...p, quantidade: Math.max(1, p.quantidade - 1) }))}
            >-</button>
            <input type="number" className="input-quantidade" value={formData.quantidade} readOnly />
            <button
              type="button"
              className="btn-counter"
              onClick={() => setFormData((p) => ({ ...p, quantidade: p.quantidade + 1 }))}
            >+</button>
          </div>
        </div>
      </div>

      {/* Porte */}
      <div className="porte-section">
        <h4><i className="fas fa-suitcase"></i> Porte da Coleta</h4>
        <div className="porte-selector">
          {["Pequeno", "Médio", "Grande"].map((tamanho) => (
            <div
              key={tamanho}
              className={`porte-btn ${formData.porte === tamanho ? "active" : ""}`}
              onClick={() => selecionarPorte(tamanho)}
            >
              <i className={`fas ${tamanho === "Pequeno" ? "fa-boxes" : tamanho === "Médio" ? "fa-archive" : "fa-briefcase"}`}></i>
              <span>{tamanho}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoLixo;