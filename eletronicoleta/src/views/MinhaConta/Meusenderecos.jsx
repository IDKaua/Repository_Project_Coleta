import React, { useState } from "react";

const ENDERECOS_MOCK = [
  {
    id: 1,
    tipo: "Endereço Principal",
    nome: "João Silva",
    rua: "Rua Exemplo, 123, Bairro, Cidade - SP",
    contato: "joao.silva@email.com",
  },
  {
    id: 2,
    tipo: "Endereço Comercial",
    rua: "Rua Exemplo, 123, Bairro, Cidade - SP",
    contato: "Cidade - SP",
  },
  {
    id: 3,
    tipo: "Outro Endereço",
    rua: "Rua Exemplo, 123, Bairro, Cidade - SP",
    contato: "Cidade - SP",
    telefone: "(10) 126580-0000",
  },
];

const MeusEnderecos = () => {
  const [enderecos, setEnderecos] = useState(ENDERECOS_MOCK);

  const remover = (id) => {
    if (window.confirm("Remover este endereço?")) {
      setEnderecos((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="conta-card enderecos-card">
      <h3 className="dados-titulo">Endereços Salvos</h3>

      <div className="enderecos-lista">
        {enderecos.map((end) => (
          <div key={end.id} className="endereco-item">
            <div className="endereco-info">
              <h4 className="endereco-tipo">{end.tipo}</h4>
              {end.nome && (
                <p><i className="fas fa-user"></i> Nome: {end.nome}</p>
              )}
              <p><i className="fas fa-map-marker-alt"></i> {end.rua}</p>
              {end.contato && (
                <p><i className="fas fa-phone"></i> {end.contato}</p>
              )}
              {end.telefone && (
                <p><i className="fas fa-id-card"></i> {end.telefone}</p>
              )}
            </div>
            <div className="endereco-acoes">
              <button className="btn-acao-icon" title="Editar">
                <i className="fas fa-pen"></i>
              </button>
              <button className="btn-acao-icon danger" title="Remover" onClick={() => remover(end.id)}>
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-salvar" style={{ marginTop: "16px" }}>
        <i className="fas fa-plus"></i> Adicionar Endereço
      </button>
    </div>
  );
};

export default MeusEnderecos;