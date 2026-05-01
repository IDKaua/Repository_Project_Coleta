import "./CoopPerfil.css";
import React, { useState, useRef, useEffect } from "react";

const formatarTelefone = (v) => {
  if (!v) return "";
  const n = v.replace(/\D/g, "").slice(0, 11);
  if (n.length <= 10) return n.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
  return n.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
};

const formatarCNPJ = (v) => {
  if (!v) return "";
  const n = v.replace(/\D/g, "").slice(0, 14);
  return n
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};

const validar = (campo, valor) => {
  switch (campo) {
    case "telefone":
      if (!valor || !valor.trim()) return "Telefone obrigatório.";
      if (valor.replace(/\D/g, "").length < 10) return "Telefone inválido (mín. 10 dígitos).";
      return "";
    case "endereco":
      if (!valor || !valor.trim()) return "Endereço obrigatório.";
      if (valor.length > 150) return "Máx. 150 caracteres.";
      return "";
    // Removemos a validação pesada do CNPJ aqui, pois ele não será mais editável
    default: return "";
  }
};

const CoopPerfil = () => {
  const fileInputRef = useRef(null);
  const [foto, setFoto] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cnpj: "",
    endereco: "",
  });

  const [editando, setEditando] = useState({ telefone: false, endereco: false });
  const [erros, setErros] = useState({});

  useEffect(() => {
    const usuarioLogadoString = localStorage.getItem('usuarioLogado');
    
    if (usuarioLogadoString) {
      const usuarioObj = JSON.parse(usuarioLogadoString);
      
      const enderecoCompleto = usuarioObj.rua 
        ? `${usuarioObj.rua || ''}, ${usuarioObj.numero || ''}, ${usuarioObj.bairro || ''}, ${usuarioObj.cidade || ''} - ${usuarioObj.estado || ''}`
        : '';

      setForm({
        nome: usuarioObj.nome || "Nome não informado",
        email: usuarioObj.email || "email@naoinformado.com",
        telefone: formatarTelefone(usuarioObj.telefone || ""),
        cnpj: formatarCNPJ(usuarioObj.documento || ""), 
        endereco: enderecoCompleto || ""
      });
    }
  }, []);

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) setFoto(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "telefone") v = formatarTelefone(value);
    if (name === "endereco") v = value.slice(0, 150);
    setForm((p) => ({ ...p, [name]: v }));
    setErros((p) => ({ ...p, [name]: validar(name, v) }));
  };

  const toggleEditar = (campo) => {
    if (editando[campo]) {
      const erro = validar(campo, form[campo]);
      setErros((p) => ({ ...p, [campo]: erro }));
      if (erro) return;
    }
    setEditando((p) => ({ ...p, [campo]: !p[campo] }));
  };

  const handleSalvar = () => {
    const novosErros = {};
    
    // Valida apenas os campos que podem ser editados
    ["telefone", "endereco"].forEach((c) => { 
      novosErros[c] = validar(c, form[c]); 
    });
    
    setErros(novosErros);
    if (Object.values(novosErros).some((e) => e)) {
      alert("Corrija os erros antes de salvar.");
      return;
    }
    setEditando({ telefone: false, endereco: false });
    alert("Alterações salvas com sucesso!");
  };

  // AQUI ESTÁ O SEGREDO: A propriedade 'editavel' controla quem tem o botão de lápis
  const campos = [
    { key: "telefone", label: "Telefone:",  placeholder: "(00) 00000-0000", editavel: true },
    { key: "cnpj",     label: "CNPJ:",      placeholder: "00.000.000/0000-00", editavel: false },
    { key: "endereco", label: "Endereço:",  placeholder: "Rua, Número, Bairro, Cidade - UF", editavel: true },
  ];

  return (
    <div className="card-content">

      {/* Avatar */}
      <div className="coop-avatar-section">
        <div
          className="coop-avatar"
          onClick={() => fileInputRef.current.click()}
          title="Clique para alterar a foto"
        >
          {foto
            ? <img src={foto} alt="Logo cooperativa" />
            : <span>🏢</span>
          }
        </div>
        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFoto} />
        <button className="btn-alterar-foto-coop" onClick={() => fileInputRef.current.click()}>
          <i className="fas fa-camera"></i> Alterar Foto
        </button>
        
        <h2 className="coop-name">{form.nome}</h2>
        <p className="coop-email">{form.email}</p>
      </div>

      <hr className="coop-divider" />

      <h3 className="coop-section-title">Dados Cadastrais</h3>

      {campos.map(({ key, label, placeholder, editavel }) => (
        <div className="coop-campo" key={key}>
          <label className="coop-label">{label}</label>
          
          <div className={`coop-input-wrap ${editavel && editando[key] ? "editando" : ""}`}>
            <input
              type="text"
              name={key}
              value={form[key]} 
              onChange={handleChange}
              placeholder={placeholder}
              readOnly={!editavel || !editando[key]} // Fica travado se não for editável
              style={{ 
                cursor: editavel && editando[key] ? "text" : "not-allowed", 
                background: editavel && editando[key] ? "#fff" : "#e5e7eb", // Fundo cinza se travado
                color: !editavel ? "#6b7280" : "inherit" // Letra mais clara para mostrar que é fixo
              }}
            />
            
            {/* O botão de lápis só aparece se o campo for 'editavel: true' */}
            {editavel && (
              <button
                type="button"
                className={`btn-lapiz-coop ${editando[key] ? "ativo" : ""}`}
                onClick={() => toggleEditar(key)}
                title={editando[key] ? "Confirmar" : "Editar"}
              >
                <i className={editando[key] ? "fas fa-check" : "fas fa-pencil-alt"}></i>
              </button>
            )}
            
          </div>
          {erros[key] && <span className="coop-erro">{erros[key]}</span>}
        </div>
      ))}

      <button className="btn-salvar-coop" onClick={handleSalvar}>Salvar Alterações</button>
    </div>
  );
};

export default CoopPerfil;