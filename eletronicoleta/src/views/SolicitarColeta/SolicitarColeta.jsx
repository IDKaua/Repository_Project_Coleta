import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SolicitarColeta.css";
import "./FormColeta.css";

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

    // Monta um endereço simples que o backend reconhece
    const enderecoStr = `${formData.rua || ""} ${formData.numero || ""}, ${formData.bairro || ""} - ${formData.cidade || ""}/${formData.uf || ""} CEP: ${formData.cep || ""}`;

    const dadosParaOJava = {
      nome: formData.nome_solicitante || usuarioLogado?.nome || "",
      endereco: enderecoStr,
      tipoResiduo: formData.tipo_residuo,
      descricao: `Coleta de ${formData.quantidade} item(ns) porte ${formData.porte}. Ponto: ${formData.ponto_referencia || "-"}. Agendamento: ${formData.data || ""} ${formData.hora || ""}`,
    };

    try {
      const resposta = await fetch(
        `http://localhost:8080/api/coletas/solicitar/${usuarioLogado.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosParaOJava),
        },
      );

      if (resposta.ok) {
        alert("Sucesso! O caminhão da cooperativa foi acionado.");
        // Dispara evento para o Header atualizar o link de rastreio
        try {
          localStorage.removeItem("rastreioOcultoUntil");
        } catch (e) {}
        window.dispatchEvent(new Event("coletaSolicitada"));
        navigate("/rastreio");
      } else {
        // Mostra mensagem retornada pelo servidor para diagnóstico
        let texto = "Erro ao solicitar a coleta.";
        try {
          texto = await resposta.text();
        } catch (e) {}
        alert(`Erro ao solicitar a coleta: ${texto}`);
        // Não navega para /rastreio quando houve falha
      }
    } catch (erro) {
      console.error("Erro no servidor:", erro);
      alert(`Erro de conexão: ${erro.message}`);
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
