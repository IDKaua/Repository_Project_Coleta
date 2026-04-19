import React, { useState } from "react";

const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || {
  nome: "João Silva",
  email: "joao.silva@email.com",
};

const MeuPerfil = () => {
  const [form, setForm] = useState({
    nome:     usuarioLogado.nome  || "",
    email:    usuarioLogado.email || "",
    telefone: "",
    cpf:      "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvar = () => {
    alert("Alterações salvas com sucesso!");
  };

  return (
    <div className="conta-card dados-card">

      {/* Saldo — canto superior direito */}
      <div className="saldo-pill">
        <i className="fas fa-star"></i>
        <div>
          <span className="saldo-label">SALDO DE PONTOS</span>
          <span className="saldo-valor">1.250 PTS</span>
        </div>
        <button className="btn-extrato">Ver Extrato</button>
      </div>

      {/* Avatar centralizado */}
      <div className="perfil-top">
        <div className="avatar-circle">
          <i className="fas fa-user-circle"></i>
        </div>
        <button className="btn-alterar-foto">Alterar Foto</button>
        <h3 className="avatar-nome">{form.nome}</h3>
        <p className="avatar-email">{form.email}</p>
      </div>

      <hr className="perfil-divider" />

      <h3 className="dados-titulo">Dados Cadastrais</h3>

      <div className="campo-grupo">
        <label>Nome:</label>
        <div className="input-icon-wrap">
          <i className="fas fa-user"></i>
          <input type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="Seu nome" />
        </div>
      </div>

      <div className="campo-grupo">
        <label>Email:</label>
        <div className="input-icon-wrap">
          <i className="fas fa-envelope"></i>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Seu email" />
        </div>
      </div>

      <div className="campo-grupo">
        <label>Telefone</label>
        <div className="input-icon-wrap">
          <i className="fas fa-phone"></i>
          <input type="text" name="telefone" value={form.telefone} onChange={handleChange} placeholder="(00) 00000-0000" />
        </div>
      </div>

      <div className="campo-grupo">
        <label>CPF</label>
        <div className="input-icon-wrap">
          <i className="fas fa-id-card"></i>
          <input type="text" name="cpf" value={form.cpf} onChange={handleChange} placeholder="000.000.000-00" />
        </div>
      </div>

      <button className="btn-salvar" onClick={handleSalvar}>Salvar Alterações</button>
    </div>
  );
};

export default MeuPerfil;