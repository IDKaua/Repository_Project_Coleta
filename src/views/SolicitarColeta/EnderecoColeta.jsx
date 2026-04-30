import React from "react";

const EnderecoColeta = ({ formData, handleChange }) => (
  <section className="coleta-card">
    <h3>Endereço da Coleta</h3>

    {/* Nome */}
    <div className="input-row">
      <div className="input-with-icon-side field-full">
        <div className="icon-box-side"><i className="fas fa-user"></i></div>
        <input type="text" name="nome_solicitante" placeholder="Nome do Solicitante"
          value={formData.nome_solicitante} onChange={handleChange} required />
      </div>
    </div>

    {/* CEP */}
    <div className="input-row">
      <div className="input-with-icon-side field-full">
        <div className="icon-box-side"><i className="fas fa-map-pin"></i></div>
        <input type="text" name="cep" placeholder="CEP"
          value={formData.cep} onChange={handleChange} required />
      </div>
    </div>

    {/* Rua + Número */}
    <div className="input-row">
      <div className="input-with-icon-side field-rua">
        <div className="icon-box-side"><i className="fas fa-home"></i></div>
        <input type="text" name="rua" placeholder="Rua"
          value={formData.rua} onChange={handleChange} required />
      </div>
      <div className="input-with-icon-side field-numero">
        <input type="text" name="numero" placeholder="Número"
          value={formData.numero} onChange={handleChange} required />
      </div>
    </div>

    {/* Bairro + Cidade + UF */}
    <div className="input-row">
      <div className="input-with-icon-side field-bairro">
        <div className="icon-box-side"><i className="fas fa-map-marker-alt"></i></div>
        <input type="text" name="bairro" placeholder="Bairro"
          value={formData.bairro} onChange={handleChange} required />
      </div>
      <div className="input-with-icon-side field-cidade">
        <div className="icon-box-side"><i className="fas fa-globe"></i></div>
        <input type="text" name="cidade" placeholder="Cidade"
          value={formData.cidade} onChange={handleChange} required />
      </div>
      <div className="input-with-icon-side field-uf">
        <div className="icon-box-side">UF</div>
        <input type="text" name="uf" placeholder="UF"
          value={formData.uf} onChange={handleChange} required />
      </div>
    </div>

    {/* Ponto de Referência */}
    <div className="input-row">
      <div className="input-with-icon-side field-full">
        <div className="icon-box-side"><i className="fas fa-map-marker-alt"></i></div>
        <input type="text" name="ponto_referencia" placeholder="Ponto de Referência"
          value={formData.ponto_referencia} onChange={handleChange} />
      </div>
    </div>
  </section>
);

export default EnderecoColeta;