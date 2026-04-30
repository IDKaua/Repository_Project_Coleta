import React, { useState } from "react";
import Campo from "../../components/FormCampo/Formulario";
import { validarCampo, validarTudo, temErros, formatarTelefone } from "../../controllers/validacoesEnderecos";

const UFS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

const FormEndereco = ({ dados, onSalvar, onCancelar, titulo }) => {
  const [form, setForm] = useState({ ...dados });
  const [erros, setErros] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    
    if (name === "telefone") v = formatarTelefone(value);
    else if (name === "uf") v = value.toUpperCase().slice(0, 2);
    else if (name === "numero") v = value.slice(0, 10);
    else if (name === "nome" || name === "cidade") v = value.replace(/[0-9]/g, "");
    
    setForm((p) => ({ ...p, [name]: v }));
    setErros((p) => ({ ...p, [name]: validarCampo(name, v) }));
  };

  const handleSalvar = () => {
    const e = validarTudo(form);
    setErros(e);
    if (temErros(e)) return;
    onSalvar(form);
  };

  return (
    <div className="form-endereco">
      <h4 className="form-end-titulo">{titulo}</h4>

      <Campo label="Tipo do Endereço" name="tipo" required value={form.tipo} onChange={handleChange} erro={erros.tipo} />
      <Campo label="Nome (opcional)" name="nome" value={form.nome} onChange={handleChange} erro={erros.nome} />

      <div className="form-row">
        <Campo label="Rua" name="rua" required value={form.rua} onChange={handleChange} erro={erros.rua} className="flex-3" />
        <Campo label="Número" name="numero" required value={form.numero} onChange={handleChange} erro={erros.numero} className="flex-1" />
      </div>

      <div className="form-row">
        <Campo label="Bairro" name="bairro" required value={form.bairro} onChange={handleChange} erro={erros.bairro} className="flex-2" />
        <Campo label="Cidade" name="cidade" required value={form.cidade} onChange={handleChange} erro={erros.cidade} className="flex-2" />
        
        <div className="campo-form-end flex-1">
          <label>UF *</label>
          <select name="uf" value={form.uf} onChange={handleChange} className={erros.uf ? "input-erro" : ""}>
            <option value="">--</option>
            {UFS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          {erros.uf && <span className="erro-campo">{erros.uf}</span>}
        </div>
      </div>

      <Campo label="Telefone (opcional)" name="telefone" value={form.telefone} onChange={handleChange} erro={erros.telefone} />

      <div className="form-end-acoes">
        <button className="btn-cancelar-end" onClick={onCancelar}>Cancelar</button>
        <button className="btn-salvar-end" onClick={handleSalvar}>Salvar</button>
      </div>
    </div>
  );
};

export default FormEndereco;