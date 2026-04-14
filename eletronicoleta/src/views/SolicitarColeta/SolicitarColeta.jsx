import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./SolicitarColeta.css";

const SolicitarColeta = () => {
  const navigate = useNavigate();

  // Criamos uma referência para o input de arquivo
  const fileInputRef = useRef(null);

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

  // Estado apenas para as fotos
  const [fotos, setFotos] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "data") {
      const ano = value.split("-")[0];
      if (ano && ano.length > 4) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Função para carregar as fotos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (fotos.length + files.length > 3) {
      alert("Máximo de 3 fotos!");
      return;
    }
    const novasFotos = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setFotos([...fotos, ...novasFotos]);
    e.target.value = "";
  };
  // FUNÇÃO PARA APAGAR A FOTO
  const removerFoto = (index, e) => {
    e.stopPropagation(); // Impede de abrir o seletor de arquivos ao clicar no X
    const novasFotos = fotos.filter((_, i) => i !== index);
    setFotos(novasFotos);
  };

  const selecionarPorte = (tamanho) => {
    setFormData((prev) => ({ ...prev, porte: tamanho }));
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
        },
      );

      if (resposta.ok) {
        alert("Sucesso! O caminhão da cooperativa foi acionado.");
        navigate("/rastreio");
      } else {
        alert("Erro ao solicitar a coleta.");
      }
    } catch (erro) {
      console.error("Erro no servidor:", erro);
      alert("Erro de conexão.");
      navigate("/rastreio")
    }
  };

  return (
    <div className="coleta-wrapper">
      <main className="coleta-container">
        <h1 className="titulo-sessao">NOVA SOLICITAÇÃO DE COLETA</h1>

        <form onSubmit={handleSubmit}>
          <section className="coleta-card upload-card-grande">
            <div className="upload-content">
              <div className="upload-text-center">
                <i
                  className="fas fa-camera"
                  style={{ fontSize: "35px", color: "#4b5563" }}
                ></i>
                <h3 style={{ fontSize: "18px", margin: "10px 0" }}>
                  Anexar Fotos
                </h3>
                <p
                  style={{ fontSize: "14px", color: "#666", margin: "10px 0" }}
                >
                  Anexe até 3 fotos do lixo eletrônico para ajudar na triagem
                </p>
                {/* Input escondido que o quadradinho vai "chamar" */}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
              <div className="upload-right-side">
                <div className="photo-placeholders">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="box-upload"
                      onClick={() => fileInputRef.current.click()}
                      style={{
                        cursor: "pointer",
                        overflow: "hidden",
                        width: "100px",
                      }}
                    >
                      {fotos[i] ? (
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <img
                            src={fotos[i].url}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            alt="Preview"
                          />
                          <button
                            className="remover-foto"
                            onClick={(e) => removerFoto(i, e)}
                            style={{
                              position: "absolute",
                              top: "4px",
                              right: "4px",
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <i
                          className="far fa-image"
                          style={{ fontSize: "24px", color: "#ccc" }}
                        ></i>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="coleta-grid">
            <section className="coleta-card card-info-lixo">
              <h3>Informações do Lixo</h3>
              <div className="info-lixo-row">
                <div className="input-item tipo-equipamento">
                  <label>
                    <i className="fas fa-desktop"></i> Tipo de Equipamento
                  </label>
                  <select
                    name="tipo_residuo"
                    value={formData.tipo_residuo}
                    onChange={handleChange}
                  >
                    <option value="Computadores">🖥️ Computadores</option>
                    <option value="Celulares">📱 Celulares</option>
                    <option value="Perifericos">⌨️ Periféricos</option>
                    <option value="Eletrodomesticos">
                      🎰 Eletrodomésticos
                    </option>
                  </select>
                </div>
                <div className="input-item quantidade-box">
                  <label>
                    <i className="fas fa-cube"></i> Quantidade Aproximada
                  </label>
                  <div className="contador-container">
                    <button
                      type="button"
                      className="btn-counter"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          quantidade: Math.max(1, p.quantidade - 1),
                        }))
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="input-quantidade"
                      value={formData.quantidade}
                      readOnly
                    />
                    <button
                      type="button"
                      className="btn-counter"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          quantidade: p.quantidade + 1,
                        }))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="porte-section">
                <h4>
                  <i className="fas fa-suitcase"></i> Porte da Coleta
                </h4>
                <div className="porte-selector">
                  <div
                    className={`porte-btn ${formData.porte === "Pequeno" ? "active" : ""}`}
                    onClick={() => selecionarPorte("Pequeno")}
                  >
                    <i className="fas fa-boxes"></i>
                    <span>Pequeno</span>
                  </div>
                  <div
                    className={`porte-btn ${formData.porte === "Médio" ? "active" : ""}`}
                    onClick={() => selecionarPorte("Médio")}
                  >
                    <i className="fas fa-archive"></i>
                    <span>Médio</span>
                  </div>
                  <div
                    className={`porte-btn ${formData.porte === "Grande" ? "active" : ""}`}
                    onClick={() => selecionarPorte("Grande")}
                  >
                    <i className="fas fa-briefcase"></i>
                    <span>Grande</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="coluna-direita">
              <section className="coleta-card">
                <h3>Endereço da Coleta</h3>
                <div className="input-row">
                  <div className="input-with-icon-side field-full">
                    <div className="icon-box-side">
                      <i className="fas fa-user"></i>
                    </div>
                    <input
                      type="text"
                      name="nome_solicitante"
                      placeholder="Nome do Solicitante"
                      value={formData.nome_solicitante}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-with-icon-side field-full">
                    <div className="icon-box-side">
                      <i className="fas fa-user"></i>
                    </div>
                    <input
                      type="text"
                      name="cep"
                      placeholder="CEP"
                      value={formData.cep}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-with-icon-side field-rua">
                    <div className="icon-box-side">
                      <i className="fas fa-home"></i>
                    </div>
                    <input
                      type="text"
                      name="rua"
                      placeholder="Rua"
                      value={formData.rua}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-with-icon-side field-numero">
                    <input
                      type="text"
                      name="numero"
                      placeholder="Número"
                      value={formData.numero}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-with-icon-side field-bairro">
                    <div className="icon-box-side">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <input
                      type="text"
                      name="bairro"
                      placeholder="Bairro"
                      value={formData.bairro}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-with-icon-side field-cidade">
                    <div className="icon-box-side">
                      <i className="fas fa-globe"></i>
                    </div>
                    <input
                      type="text"
                      name="cidade"
                      placeholder="Cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-with-icon-side field-uf">
                    <div className="icon-box-side">UF</div>
                    <input
                      type="text"
                      name="uf"
                      placeholder="UF"
                      value={formData.uf}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-with-icon-side field-full">
                    <div className="icon-box-side">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <input
                      type="text"
                      name="ponto_referencia"
                      placeholder="Ponto de Referência"
                      value={formData.ponto_referencia}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </section>

              <section className="coleta-card">
                <div className="agendamento-header">
                  <h3>Agendamento</h3>
                  <div className="header-icons">
                    <div className="icon-box-small">
                      <i className="fas fa-calendar-alt"></i>
                    </div>
                    <div className="icon-box-small">
                      <i className="fas fa-clock"></i>
                    </div>
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-with-icon-side field-full">
                    <div className="icon-box-side">
                      <i className="fas fa-calendar-alt"></i>
                    </div>
                    <input
                      type="date"
                      name="data"
                      value={formData.data}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-with-icon-side field-full">
                    <div className="icon-box-side">
                      <i className="fas fa-clock"></i>
                    </div>
                    <input
                      type="time"
                      name="hora"
                      value={formData.hora}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </section>
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
