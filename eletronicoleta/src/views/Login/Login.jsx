import React, { useState } from 'react';
import './login.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Novo state para o olho
  const [error, setError] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setError('');
    console.log('Login solicitado:', { identificador, password });
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
            <div className="password-wrapper"> {/* Wrapper para o posicionamento */}
              <input
                type={showPassword ? "text" : "password"} // Alterna o tipo aqui
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
            {error && <span className="error-message">{error}</span>}
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