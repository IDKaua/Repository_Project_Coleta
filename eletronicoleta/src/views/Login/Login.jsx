import React, { useState } from 'react';
import './login.css';
import { Link, useNavigate } from 'react-router-dom'; // Adicionamos o useNavigate aqui

const Login = () => {
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Ferramenta do React para redirecionar de página
  const navigate = useNavigate(); 

  const handleIdentificadorChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      value = value.substring(0, 14);
      value = value.replace(/^(\d{2})(\d)/, "$1.$2");
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
      value = value.replace(/(\d{4})(\d)/, "$1-$2");
    }
    setIdentificador(value);
  };

  // >>> A MÁGICA DA INTEGRAÇÃO ACONTECE AQUI <<<
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setError(''); // Limpa os erros antes de tentar

    try {
      // 1. O React bate na porta do Java
      const resposta = await fetch("http://localhost:8080/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          documento: identificador, // Pega o CPF/CNPJ da tela
          senha: password           // Pega a senha da tela
        })
      });

      // 2. O React lê a resposta do Java
      if (resposta.ok) {
        // Sucesso! Pega os dados do usuário que o Java devolveu
        const dadosDoUsuario = await resposta.json();
        
        // Salva o usuário no navegador (para lembrarmos quem está logado nas outras telas)
        localStorage.setItem('usuarioLogado', JSON.stringify(dadosDoUsuario));

        alert(`Bem-vindo, ${dadosDoUsuario.nome}!`);

        // Redireciona o usuário para a tela principal (Ajuste a rota "/home" para a rota correta do seu projeto)
        navigate('/home'); 

      } else {
        // Erro 401 ou 404 (Senha errada ou usuário não existe)
        const mensagemErro = await resposta.text();
        setError(mensagemErro || 'CPF/CNPJ ou senha incorretos.');
      }

    } catch (err) {
      // Se o Java estiver desligado, cai aqui
      console.error("Erro no servidor:", err);
      setError("Não foi possível conectar ao servidor. Verifique se ele está ligado.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <span className="icon-leaf">🌿</span>
          <h2>EcoTech</h2>
          <p>Sistema de Resíduos Eletrônicos</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="identificador">CPF ou CNPJ</label>
            <input
              type="text"
              id="identificador"
              placeholder="Digite seu CPF ou CNPJ"
              value={identificador}
              onChange={handleIdentificadorChange}
              required
              maxLength="18"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value.length >= 6) setError('');
                }}
                required
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {error && <span className="error-message" style={{ color: 'red', marginTop: '5px', display: 'block' }}>{error}</span>}
          </div>

          <button type="submit" className="btn-login">Entrar</button>
        </form>

        <div className="login-footer">
          <a href="/forgot">Esqueceu a senha?</a>
          <span>Não tem conta? <Link to="/cadastro">Cadastre-se</Link></span>
        </div>
      </div>
    </div>
  );
};

export default Login;