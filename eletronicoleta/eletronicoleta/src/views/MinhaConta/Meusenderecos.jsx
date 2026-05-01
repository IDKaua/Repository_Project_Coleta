import React, { useState } from "react";
import FormEndereco from "./FormEndereco";
import "./MeusEnderecos.css"

const ENDERECOS_MOCK = [
  { id: 1, tipo: "Endereço Principal", nome: "João Silva", rua: "Rua Exemplo", numero: "123", bairro: "Bairro", cidade: "Cidade", uf: "SP", telefone: "" },
];

const ENDERECO_VAZIO = { id: null, tipo: "Novo Endereço", nome: "", rua: "", numero: "", bairro: "", cidade: "", uf: "", telefone: "" };

const MeusEnderecos = () => {
  const [enderecos, setEnderecos] = useState(ENDERECOS_MOCK);
  const [editandoId, setEditandoId] = useState(null);
  const [adicionando, setAdicionando] = useState(false);

  const remover = (id) => {
    if (window.confirm("Remover este endereço?"))
      setEnderecos((p) => p.filter((e) => e.id !== id));
  };

  const salvarEdicao = (form) => {
    setEnderecos((p) => p.map((e) => (e.id === form.id ? form : e)));
    setEditandoId(null);
  };

  const salvarNovo = (form) => {
    const novo = { ...form, id: Date.now() };
    setEnderecos((p) => [...p, novo]);
    setAdicionando(false);
  };

  return (
    <div className="conta-card enderecos-card">
      <h3 className="dados-titulo">Endereços Salvos</h3>

      <div className="enderecos-lista">
        {enderecos.map((end) => (
          <div key={end.id}>
            {editandoId === end.id ? (
              <FormEndereco
                dados={end}
                titulo={`Editar: ${end.tipo}`}
                onSalvar={salvarEdicao}
                onCancelar={() => setEditandoId(null)}
              />
            ) : (
              <div className="endereco-item">
                <div className="endereco-info">
                  <h4 className="endereco-tipo">{end.tipo}</h4>
                  {end.nome && <p><i className="fas fa-user"></i> {end.nome}</p>}
                  <p><i className="fas fa-map-marker-alt"></i> {end.rua}, {end.numero} — {end.bairro}, {end.cidade} - {end.uf}</p>
                  {end.telefone && <p><i className="fas fa-phone"></i> {end.telefone}</p>}
                </div>
                <div className="endereco-acoes">
                  <button className="btn-acao-icon" title="Editar" onClick={() => setEditandoId(end.id)}><i className="fas fa-pen"></i></button>
                  <button className="btn-acao-icon danger" title="Remover" onClick={() => remover(end.id)}><i className="fas fa-trash"></i></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {adicionando ? (
        <FormEndereco dados={ENDERECO_VAZIO} titulo="Novo Endereço" onSalvar={salvarNovo} onCancelar={() => setAdicionando(false)} />
      ) : (
        <button className="btn-salvar" style={{ marginTop: "16px" }} onClick={() => setAdicionando(true)}>
          <i className="fas fa-plus"></i> Adicionar Endereço
        </button>
      )}
    </div>
  );
};

export default MeusEnderecos;