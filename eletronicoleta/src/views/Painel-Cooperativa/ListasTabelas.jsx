import React, { useState, forwardRef } from "react";

export const ListaColetores = forwardRef(({ onSelect, estaAtribuindo }, ref) => {
  const [coletores, setColetores] = useState([
    { nome: "Carlos Silva", cpf: "123.456.789-00", email: "carlos@email.com", status: "Ativo" },
    { nome: "Ana Souza", cpf: "987.654.321-00", email: "ana@email.com", status: "Em Rota" },
    { nome: "João Ferreira", cpf: "456.123.789-00", email: "joao@email.com", status: "Inativo" },
  ]);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [formData, setFormData] = useState({ nome: "", cpf: "", email: "" });

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

  const handleSalvar = (e) => {
    e.preventDefault();
    if (!validarCPF(formData.cpf)) {
      alert("Por favor, insira um CPF válido com 11 dígitos.");
      return;
    }
    const novo = { ...formData, status: "Ativo" };
    setColetores([...coletores, novo]);
    setMostrarForm(false);
    setFormData({ nome: "", cpf: "", email: "" });
  };

  const selecionarColetor = (coletorSelecionado) => {
    if (estaAtribuindo) {
      if (coletorSelecionado.status === "Ativo") {

        // 🔥 Atualiza status para "Em Rota"
        setColetores((prev) =>
          prev.map((c) =>
            c.nome === coletorSelecionado.nome
              ? { ...c, status: "Em Rota" }
              : c
          )
        );

        // Continua fluxo
        onSelect(coletorSelecionado.nome);

      } else {
        alert("Este coletor não está disponível (Status: " + coletorSelecionado.status + ").");
      }
    }
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
            {coletores.map((coletor, index) => (
              <tr
                key={index}
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