import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cadastro.css';

const ESTADOS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", 
"ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE",
"PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

const Cadastro = () => {
  const navigate = useNavigate();
  
  // Controle para alternar entre Usuário e Cooperativa
  const [isCooperativa, setIsCooperativa] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    identificador: '', // Campo único que serve para CPF ou CNPJ
    telefone: '',
    endereco: '',
    cep: '',
    complemento: '',
    cidade: '',
    estado: '',
    senha: '',
    confirmarSenha: ''
  });

  // --- FUNÇÕES DE MÁSCARA ---
  const maskIdentificador = (value) => {
    const raw = value.replace(/\D/g, "");
    if (!isCooperativa) {
      // Máscara CPF
      return raw.replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
                .slice(0, 14);
    } else {
      // Máscara CNPJ
      return raw.replace(/^(\d{2})(\d)/, "$1.$2")
                .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
                .replace(/\.(\d{3})(\d)/, ".$1/$2")
                .replace(/(\d{4})(\d)/, "$1-$2")
                .slice(0, 18);
    }
  };

  const maskPhone = (value) => {
    return value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 15);
  };

  const maskCEP = (value) => {
    return value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "identificador") formattedValue = maskIdentificador(value);
    if (name === "telefone") formattedValue = maskPhone(value);
    if (name === "cep") formattedValue = maskCEP(value);

    setFormData({ ...formData, [name]: formattedValue });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }
    console.log("Cadastro realizado:", { ...formData, tipo: isCooperativa ? 'Cooperativa' : 'Usuário' });
    alert("Cadastro concluído com sucesso!");
    navigate('/login');
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-box">
        {/* Alternador de Tipo de Cadastro */}
        <div className="tipo-cadastro-toggle">
          <button 
            className={!isCooperativa ? "active" : ""} 
            onClick={() => { setIsCooperativa(false); setFormData({...formData, identificador: ''}) }}
          >
            Usuário
          </button>
          <button 
            className={isCooperativa ? "active" : ""} 
            onClick={() => { setIsCooperativa(true); setFormData({...formData, identificador: ''}) }}
          >
            Cooperativa
          </button>
        </div>

        <h2>{isCooperativa ? "Cadastro de Cooperativa" : "Criar Conta de Usuário"}</h2>
        <p>{isCooperativa ? "Gerencie coletas e sua equipe" : "Junte-se à nossa rede de descarte inteligente"}</p>

        <form onSubmit={handleRegister}>
          <div className="input-field">
            <label>{isCooperativa ? "Nome da Cooperativa" : "Nome Completo"}</label>
            <input type="text" name="nome" placeholder={isCooperativa ? "Ex: Eco Recicla" : "Ex: Flavio Miguel"} required value={formData.nome} onChange={handleChange} />
          </div>

          <div className="input-field">
            <label>{isCooperativa ? "CNPJ" : "CPF"}</label>
            <input 
              type="text" 
              name="identificador" 
              placeholder={isCooperativa ? "00.000.000/0000-00" : "000.000.000-00"} 
              value={formData.identificador} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-field">
            <label>E-mail</label>
            <input type="email" name="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="input-field">
            <label>Telefone / WhatsApp</label>
            <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(00) 00000-0000" required />
          </div>

          <div className="input-row">
            <div className="input-field flex-3">
              <label>Endereço</label>
              <input type="text" name="endereco" placeholder="Rua, número, bairro" value={formData.endereco} onChange={handleChange} required />
            </div>
            <div className="input-field flex-2">
              <label>CEP</label>
              <input type="text" name="cep" placeholder="00000-000" value={formData.cep} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-field">
            <label>Complemento (Opcional)</label>
            <input type="text" name="complemento" placeholder="Apto, bloco, casa 2..." value={formData.complemento} onChange={handleChange} />
          </div>

          <div className="input-row">
            <div className="input-field flex-3">
              <label>Cidade</label>
              <input type="text" name="cidade" placeholder="Cidade" value={formData.cidade} onChange={handleChange} required />
            </div>
            <div className="input-field flex-1">
              <label>Estado</label>
              <select name="estado" value={formData.estado} onChange={handleChange} required>
                <option value="">UF</option>
                {ESTADOS.map((uf) => (<option key={uf} value={uf}>{uf}</option>))}
              </select>
            </div>
          </div>

          <div className="input-field">
            <label>Senha</label>
            <input type="password" name="senha" placeholder="Mínimo 6 caracteres" minLength="6" value={formData.senha} onChange={handleChange} required />
          </div>

          <div className="input-field">
            <label>Confirmar Senha</label>
            <input type="password" name="confirmarSenha" placeholder="Repita sua senha" value={formData.confirmarSenha} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn-cadastrar">Finalizar Cadastro</button>
        </form>

        <button className="btn-voltar" onClick={() => navigate('/login')}>
          Já tenho conta? Ir para Login
        </button>
      </div>
    </div>
  );
};

export default Cadastro;