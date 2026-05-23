import React, { useState, useEffect, forwardRef } from "react";

export const ListaColetores = forwardRef(({ onSelect, estaAtribuindo, onCancelar }, ref) => {
  const [coletores, setColetores] = useState([
    {
      id: 1,
      nome: "Carlos Silva",
      cpf: "123.456.789-00",
      email: "carlos@email.com",
      status: "Ativo",
      placaVeiculo: "ABC-1234",
      cnh: "123456",
    },
    {
      id: 2,
      nome: "Ana Souza",
      cpf: "987.654.321-00",
      email: "ana@email.com",
      status: "Em Rota",
      placaVeiculo: "XYZ-5678",
      cnh: "789012",
    },
    {
      id: 3,
      nome: "João Ferreira",
      cpf: "456.123.789-00",
      email: "joao@email.com",
      status: "Inativo",
      placaVeiculo: "DEF-9012",
      cnh: "345678",
    },
  ]);

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  const [mostrarForm, setMostrarForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
  });

  const formatarCPF = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const validarCPF = (cpf) => {
    const limpo = cpf.replace(/\D/g, "");
    return limpo.length === 11;
  };

  const carregarColetores = async () => {
    if (!usuarioLogado || usuarioLogado.tipoUsuario !== "COOPERATIVA") return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/cooperativas/${usuarioLogado.id}/meus-coletores`
      );

      if (res.ok) {
        const dados = await res.json();

        if (dados && dados.length > 0) {
          const mapeados = dados.map((col) => ({
            id: col.id,
            nome: col.nome,
            cpf: col.documento || "",
            email: col.email || "",
            status: "Ativo",
            placaVeiculo: col.placaVeiculo || "ABC-1234",
            cnh: col.cnh || "123456",
          }));

          setColetores(mapeados);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar coletores:", err);
    }
  };

  useEffect(() => {
    carregarColetores();
  }, [usuarioLogado?.id]);

  const handleSalvar = async (e) => {
    e.preventDefault();

    if (!validarCPF(formData.cpf)) {
      alert("Por favor, insira um CPF válido com 11 dígitos.");
      return;
    }

    if (usuarioLogado && usuarioLogado.id) {
      const novoColetor = {
        nome: formData.nome,
        documento: formData.cpf,
        email: formData.email,
        senha: "senhaColetor123",
        telefone: "82999999999",
        tipoUsuario: "COLETOR",
        cnh: "123456789",
        placaVeiculo: "ABC-1234",
      };

      try {
        const res = await fetch(
          `http://localhost:8080/api/cooperativas/${usuarioLogado.id}/cadastrar-coletor`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(novoColetor),
          }
        );

        if (res.ok) {
          await carregarColetores();
          setMostrarForm(false);
          setFormData({ nome: "", cpf: "", email: "" });
        } else {
          const erroMsg = await res.text();
          alert(erroMsg || "Erro ao cadastrar coletor no backend.");
        }
      } catch (err) {
        console.error("Erro ao salvar coletor:", err);
        alert("Erro ao conectar com o servidor. Verifique se o backend está rodando.");
      }
    } else {
      const novo = {
        id: Date.now(),
        nome: formData.nome,
        cpf: formData.cpf,
        email: formData.email,
        status: "Ativo",
        placaVeiculo: "ABC-1234",
        cnh: "123456",
      };

      setColetores((prev) => [...prev, novo]);
      setMostrarForm(false);
      setFormData({ nome: "", cpf: "", email: "" });
    }
  };

  const selecionarColetor = (coletorSelecionado) => {
    if (!estaAtribuindo) return;

    if (coletorSelecionado.status !== "Ativo") {
      alert(
        "Este coletor não está disponível. Status: " +
          coletorSelecionado.status
      );
      return;
    }

    setColetores((prev) =>
      prev.map((c) =>
        c.id === coletorSelecionado.id
          ? { ...c, status: "Em Rota" }
          : c
      )
    );

    onSelect(coletorSelecionado);
  };

  return (
    <section className="painel-card" ref={ref}>
      <div className="card-header-tag">
        <i className="fas fa-users"></i>

        <h3>
          {estaAtribuindo
            ? "SELECIONE UM COLETOR ATIVO"
            : "LISTA DE COLETORES DA COOPERATIVA"}
        </h3>

        {!estaAtribuindo && (
          <button
            className="btn-novo"
            onClick={() => setMostrarForm(!mostrarForm)}
          >
            <i className="fas fa-plus"></i>{" "}
            {mostrarForm ? "Fechar" : "Novo Coletor"}
          </button>
        )}

        {estaAtribuindo && onCancelar && (
          <button
            className="btn-cancelar"
            onClick={onCancelar}
          >
            <i className="fas fa-times"></i> Cancelar
          </button>
        )}
      </div>

      {mostrarForm && !estaAtribuindo && (
        <div
          className="form-cadastro-container"
          style={{
            background: "#f9fafb",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px",
          }}
        >
          <form onSubmit={handleSalvar}>
            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
              }}
            >
              <div className="campo-form-end">
                <label>Nome Completo</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                />
              </div>

              <div className="campo-form-end">
                <label>CPF</label>
                <input
                  type="text"
                  required
                  maxLength="14"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cpf: formatarCPF(e.target.value),
                    })
                  }
                />
              </div>

              <div className="campo-form-end">
                <label>E-mail</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-novo"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: "15px",
              }}
            >
              SALVAR COLETOR
            </button>
          </form>
        </div>
      )}

      <div className="table-wrapper">
        <table className="painel-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {coletores.map((coletor) => (
              <tr
                key={coletor.id}
                onClick={() => selecionarColetor(coletor)}
                style={{
                  cursor:
                    estaAtribuindo && coletor.status === "Ativo"
                      ? "pointer"
                      : "default",
                }}
              >
                <td>{coletor.nome}</td>
                <td>{coletor.cpf}</td>
                <td>{coletor.email}</td>
                <td>
                  <span
                    className={`nivel-tag ${
                      coletor.status === "Ativo"
                        ? "nivel-baixo"
                        : coletor.status === "Em Rota"
                        ? "nivel-medio"
                        : "nivel-cheio"
                    }`}
                  >
                    {coletor.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
});

export const ListaConteineres = () => (
  <section className="painel-card">
    <div className="card-header-tag">
      <i className="fas fa-box"></i>
      <h3>LISTA DE CONTÊINERES CADASTRADOS</h3>

      <button className="btn-novo">
        <i className="fas fa-plus"></i> Novo Contêiner
      </button>
    </div>

    <div className="table-wrapper">
      <table className="painel-table">
        <thead>
          <tr>
            <th>Localização</th>
            <th>Capacidade</th>
            <th>Nível</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Rua das Flores, 120 — Maceió</td>
            <td>500 kg</td>
            <td>
              <span className="nivel-tag nivel-medio">Médio</span>
            </td>
          </tr>

          <tr>
            <td>Av. Fernandes Lima, 340 — Maceió</td>
            <td>1000 kg</td>
            <td>
              <span className="nivel-tag nivel-cheio">Cheio</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
);