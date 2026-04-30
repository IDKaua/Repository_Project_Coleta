import React, { useState, useRef, useEffect } from "react";

const EXTRATO_MOCK = [
  { data: "03/07/2023", descricao: "Coleta realizada",  pontos: "+250 PTS" },
  { data: "06/07/2023", descricao: "Coleta realizada",  pontos: "+500 PTS" },
  { data: "10/07/2023", descricao: "Bônus de cadastro", pontos: "+500 PTS" },
];

const MeuPerfil = () => {
  const fileInputRef = useRef(null);

  const [foto, setFoto] = useState(null);
  const [mostrarExtrato, setMostrarExtrato] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
  });

  const [editando, setEditando] = useState({
    nome: false, email: false, telefone: false,
  });

  const [erros, setErros] = useState({});

  // ── MÁGICA: Buscar dados da memória ao abrir a tela ────────
  useEffect(() => {
    const usuarioLogadoString = localStorage.getItem("usuarioLogado");
    
    if (usuarioLogadoString) {
      const usuarioObj = JSON.parse(usuarioLogadoString);
      setForm({
        nome: usuarioObj.nome || "Nome não informado",
        email: usuarioObj.email || "email@naoinformado.com",
        telefone: formatarTelefone(usuarioObj.telefone || ""),
        cpf: formatarCPF(usuarioObj.documento || ""), // Puxa do documento salvo no login
      });
    }
  }, []);

  // ── Foto ─────────────────────────────────────────────────
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFoto(url);
  };

  // ── Formatações ──────────────────────────────────────────
  const formatarTelefone = (valor) => {
    if (!valor) return "";
    const nums = valor.replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 10)
      return nums.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
    return nums.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
  };

  const formatarCPF = (valor) => {
    if (!valor) return "";
    const nums = valor.replace(/\D/g, "").slice(0, 11);
    return nums
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  // ── Validações ───────────────────────────────────────────
  const validar = (campo, valor) => {
    switch (campo) {
      case "nome":
        if (!valor || !valor.trim()) return "Nome é obrigatório.";
        if (valor.trim().length < 3) return "Nome muito curto.";
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(valor)) return "Nome não pode conter números.";
        return "";
      case "email":
        if (!valor || !valor.trim()) return "Email é obrigatório.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return "Email inválido.";
        return "";
      case "telefone":
        if (valor && valor.replace(/\D/g, "").length < 10) return "Telefone inválido (mín. 10 dígitos).";
        return "";
      default: return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let novoValor = value;
    if (name === "telefone") novoValor = formatarTelefone(value);
    if (name === "nome")     novoValor = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "").slice(0, 80);
    if (name === "email")    novoValor = value.slice(0, 100);
    setForm((prev) => ({ ...prev, [name]: novoValor }));
    setErros((prev) => ({ ...prev, [name]: validar(name, novoValor) }));
  };

  const toggleEditar = (campo) => {
    if (editando[campo]) {
      const erro = validar(campo, form[campo]);
      setErros((prev) => ({ ...prev, [campo]: erro }));
      if (erro) return;
    }
    setEditando((prev) => ({ ...prev, [campo]: !prev[campo] }));
  };

  const handleSalvar = () => {
    const novosErros = {};
    ["nome", "email", "telefone"].forEach((c) => { novosErros[c] = validar(c, form[c]); });
    
    setErros(novosErros);
    if (Object.values(novosErros).some((e) => e)) {
      alert("Corrija os erros antes de salvar.");
      return;
    }
    setEditando({ nome: false, email: false, telefone: false });
    alert("Alterações salvas com sucesso!");
  };

  // ADICIONAMOS A PROPRIEDADE EDITAVEL AQUI!
  const campos = [
    { key: "nome",     label: "Nome:",    icon: "fas fa-user",     type: "text",  placeholder: "Seu nome completo", editavel: true },
    { key: "email",    label: "Email:",   icon: "fas fa-envelope", type: "email", placeholder: "seu@email.com",     editavel: true },
    { key: "telefone", label: "Telefone", icon: "fas fa-phone",    type: "text",  placeholder: "(00) 00000-0000",   editavel: true },
    { key: "cpf",      label: "CPF",      icon: "fas fa-id-card",  type: "text",  placeholder: "000.000.000-00",    editavel: false },
  ];

  return (
    <div className="conta-card dados-card">

      {/* Saldo pill */}
      <div className="saldo-pill">
        <i className="fas fa-star"></i>
        <div>
          <span className="saldo-label">SALDO DE PONTOS</span>
          <span className="saldo-valor">1.250 PTS</span>
        </div>
        <button className="btn-extrato" onClick={() => setMostrarExtrato(!mostrarExtrato)}>
          {mostrarExtrato ? "Fechar" : "Ver Extrato"}
        </button>
      </div>

      {/* Extrato inline */}
      {mostrarExtrato && (
        <div className="extrato-box">
          <h4 className="extrato-titulo">Extrato de Pontos</h4>
          <table className="extrato-table">
            <thead>
              <tr><th>Data</th><th>Descrição</th><th>Pontos</th></tr>
            </thead>
            <tbody>
              {EXTRATO_MOCK.map((item, i) => (
                <tr key={i}>
                  <td>{item.data}</td>
                  <td>{item.descricao}</td>
                  <td className="pontos-col">{item.pontos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Avatar */}
      <div className="perfil-top">
        <div className="avatar-circle" onClick={() => fileInputRef.current.click()} style={{ cursor: "pointer" }}>
          {foto
            ? <img src={foto} alt="Foto" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            : <i className="fas fa-user-circle"></i>
          }
        </div>
        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFotoChange} />
        <button className="btn-alterar-foto" onClick={() => fileInputRef.current.click()}>
           <i className="fas fa-camera"></i> Alterar Foto
        </button>
        <h3 className="avatar-nome">{form.nome}</h3>
        <p className="avatar-email">{form.email}</p>
      </div>

      <hr className="perfil-divider" />
      <h3 className="dados-titulo">Dados Cadastrais</h3>

      {campos.map(({ key, label, icon, type, placeholder, editavel }) => (
        <div className="campo-grupo" key={key}>
          <label>{label}</label>
          <div className={`input-icon-wrap ${editavel && editando[key] ? "editando" : ""}`}>
            <i className={icon}></i>
            <input
              type={type}
              name={key}
              value={form[key]}
              onChange={handleChange}
              placeholder={placeholder}
              readOnly={!editavel || !editando[key]}
              style={{ 
                cursor: editavel && editando[key] ? "text" : "not-allowed", 
                background: editavel && editando[key] ? "#fff" : (!editavel ? "#e5e7eb" : "#f9fafb"),
                color: !editavel ? "#6b7280" : "inherit"
              }}
            />
            
            {/* O botão de lápis só aparece se editavel for true */}
            {editavel && (
              <button
                type="button"
                className={`btn-lapiz ${editando[key] ? "ativo" : ""}`}
                onClick={() => toggleEditar(key)}
                title={editando[key] ? "Confirmar edição" : "Editar campo"}
              >
                <i className={editando[key] ? "fas fa-check" : "fas fa-pencil-alt"}></i>
              </button>
            )}

          </div>
          {erros[key] && <span className="erro-campo">{erros[key]}</span>}
        </div>
      ))}

      <button className="btn-salvar" onClick={handleSalvar}>Salvar Alterações</button>
    </div>
  );
};

export default MeuPerfil;