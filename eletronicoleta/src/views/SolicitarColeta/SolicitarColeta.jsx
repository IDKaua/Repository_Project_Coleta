import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SolicitarColeta.css";
import "./FormColeta.css"

import UploadFotos from "./UploadFotos";
import InfoLixo from "./InfoLixo";
import EnderecoColeta from "./EnderecoColeta";
import Agendamento from "./Agendamento";

const SolicitarColeta = () => {
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  useEffect(() => {
    if (!usuarioLogado) {
      alert("Você precisa estar logado para solicitar uma coleta!");
      navigate("/login");
    }
  }, [usuarioLogado, navigate]);

  const [formData, setFormData] = useState({
    tipo_residuo: "Computadores",
    quantidade: 1,
    porte: "Pequeno",
    nome_solicitante: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "",
    ponto_referencia: "",
    data: "",
    hora: "",
  });

  const [fotos, setFotos] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "data") {
      const ano = value.split("-")[0];
      if (ano && ano.length > 4) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuarioLogado) return;

    const dadosParaOJava = {
      tipoResiduo: formData.tipo_residuo,
      quantidade: formData.quantidade,
      porte: formData.porte,
      nomeSolicitante: formData.nome_solicitante,
      cep: formData.cep,
      rua: formData.rua,
      numero: formData.numero,
      bairro: formData.bairro,
      cidade: formData.cidade,
      uf: formData.uf,
      pontoReferencia: formData.ponto_referencia,
      dataAgendamento: formData.data,
      horaAgendamento: formData.hora,
      descricao: `Coleta de ${formData.quantidade} item(ns) porte ${formData.porte}.`,
    };

    try {
      const resposta = await fetch(
        `http://localhost:8080/api/coletas/solicitar/${usuarioLogado.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosParaOJava),
        }
      );

      if (resposta.ok) {
        alert("Sucesso! O caminhão da cooperativa foi acionado.");
        navigate("/rastreio");
      } else {
        alert("Erro ao solicitar a coleta.");
        navigate("/rastreio");
      }
    } catch (erro) {
      console.error("Erro no servidor:", erro);
      alert("Erro de conexão.");
      navigate("/rastreio");
    }
  };

  return (
    <div className="coleta-wrapper">
      <main className="coleta-container">
        <h1 className="titulo-sessao">NOVA SOLICITAÇÃO DE COLETA</h1>

        <form onSubmit={handleSubmit}>
          <UploadFotos fotos={fotos} setFotos={setFotos} />

          <div className="coleta-grid">
            <InfoLixo
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
            />

            <div className="coluna-direita">
              <EnderecoColeta formData={formData} handleChange={handleChange} />
              <Agendamento formData={formData} handleChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="btn-enviar-solicitacao">
            ENVIAR SOLICITAÇÃO
          </button>
        </form>
      </main>
    </div>
  );
};

export default SolicitarColeta;