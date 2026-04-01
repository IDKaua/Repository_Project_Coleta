import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SolicitarColeta.css';

const SolicitarColeta = () => {
  const navigate = useNavigate();

  // 1. Buscamos o usuário que logou no sistema (salvo no passo do Login)
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  // Se o cara tentar entrar nessa tela sem fazer login, expulsamos ele de volta pro Login
  useEffect(() => {
    if (!usuarioLogado) {
      alert("Você precisa estar logado para solicitar uma coleta!");
      navigate('/login');
    }
  }, [usuarioLogado, navigate]);

  const [formData, setFormData] = useState({
    tipo_residuo: 'Computadores',
    quantidade: 1,
    porte: 'Pequeno',
    nome_solicitante: '',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: '',
    ponto_referencia: '',
    data: '',
    hora: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selecionarPorte = (tamanho) => {
    setFormData(prev => ({ ...prev, porte: tamanho }));
  };

  // --- A MÁGICA DA INTEGRAÇÃO DA COLETA ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuarioLogado) return;

    // 2. Montamos o pacote com todos os dados da tela para mandar pro Java
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
      // Juntamos uma descrição rápida caso precise
      descricao: `Coleta de ${formData.quantidade} item(ns) porte ${formData.porte}.`
    };

    try {
      // 3. O fetch usando o ID do usuário logado na URL!
      const resposta = await fetch(`http://localhost:8080/api/coletas/solicitar/${usuarioLogado.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosParaOJava)
      });

      if (resposta.ok) {
        alert("Sucesso! O caminhão da cooperativa foi acionado.");
        navigate('/home'); // Manda o usuário de volta para a tela inicial
      } else if (resposta.status === 400) {
        // AQUI BRILHA A NOSSA REGRA DE NEGÓCIO DO "LEÃO DE CHÁCARA"!
        const mensagemTrava = await resposta.text();
        alert("Atenção: " + mensagemTrava); 
      } else {
        alert("Erro ao solicitar a coleta.");
      }
    } catch (erro) {
      console.error("Erro no servidor:", erro);
      alert("Erro de conexão. Verifique se o servidor backend está ligado.");
    }
  };

  return (
    <div className="coleta-wrapper">
      <main className="coleta-container">
        <h1 className="titulo-sessao">NOVA SOLICITAÇÃO DE COLETA</h1>

        {/* Adicionamos o onSubmit no form para disparar a função */}
        <form onSubmit={handleSubmit}>
          
          <section className="coleta-card upload-card-grande">
            <div className="upload-content">
              <div className="upload-text-center">
                <i className="fas fa-camera" style={{ fontSize: '35px', color: '#4b5563' }}></i>
                <h3 style={{ fontSize: '18px', margin: '10px 0' }}>Anexar Fotos</h3>
                <p style={{ fontSize: '14px', color: '#666', margin: '10px 0' }}>
                  Anexe até 3 fotos do lixo eletrônico para ajudar na triagem
                </p>
              </div>
              <div className="upload-right-side">
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}></span>
                <div className="photo-placeholders">
                  <div className="box-upload"><i className="far fa-image"></i></div>
                  <div className="box-upload"><i className="far fa-image"></i></div>
                  <div className="box-upload"><i className="far fa-image"></i></div>
                </div>
              </div>
            </div>
          </section>

          <div className="coleta-grid">
            <section className="coleta-card">
              <h3>Informações do Lixo</h3>
              <div className="info-lixo-row">
                <div className="input-item tipo-equipamento">
                  <label><i className="fas fa-desktop"></i> Tipo de Equipamento</label>
                  <select name="tipo_residuo" value={formData.tipo_residuo} onChange={handleChange}>
                    <option value="Computadores">🖥️ Computadores</option>
                    <option value="Celulares">📱 Celulares</option>
                    <option value="Perifericos">⌨️ Periféricos</option>
                    <option value="Eletrodomesticos">🎰 Eletrodomésticos</option>
                  </select>
                </div>
                <div className="input-item quantidade-box">
                  <label><i className="fas fa-cube"></i> Quantidade Aproximada</label>
                  <div className="contador-container">
                    <button type="button" className="btn-counter" onClick={() => setFormData(p => ({...p, quantidade: Math.max(1, p.quantidade-1)}))}>-</button>
                    <input type="number" className="input-quantidade" value={formData.quantidade} readOnly />
                    <button type="button" className="btn-counter" onClick={() => setFormData(p => ({...p, quantidade: p.quantidade+1}))}>+</button>
                  </div>
                </div>
              </div>

              <div className="porte-section">
                <h4><i className="fas fa-suitcase"></i> Porte da Coleta</h4>
                <div className="porte-selector">
                  <div 
                    className={`porte-btn ${formData.porte === 'Pequeno' ? 'active' : ''}`}
                    onClick={() => selecionarPorte('Pequeno')}
                  >
                    <i className="fas fa-boxes"></i>
                    <span>Pequeno</span>
                  </div>
                  <div 
                    className={`porte-btn ${formData.porte === 'Médio' ? 'active' : ''}`}
                    onClick={() => selecionarPorte('Médio')}
                  >
                    <i className="fas fa-archive"></i>
                    <span>Médio</span>
                  </div>
                  <div 
                    className={`porte-btn ${formData.porte === 'Grande' ? 'active' : ''}`}
                    onClick={() => selecionarPorte('Grande')}
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
                <div className="input-with-icon-side">
                  <div className="icon-box-side"><i className="fas fa-user"></i></div>
                  <input type="text" name="nome_solicitante" value={formData.nome_solicitante} placeholder="Nome do Solicitante" onChange={handleChange} required/>
                </div>
                <div className="input-with-icon-side">
                  <div className="icon-box-side"><i className="fas fa-map"></i></div>
                  <input type="text" name="cep" value={formData.cep} placeholder="CEP" onChange={handleChange} required/>
                </div>
                <div className="endereco-linha-dupla">
                  <div className="input-with-icon-side flex-grow">
                    <div className="icon-box-side"><i className="fas fa-home"></i></div>
                    <input type="text" name="rua" value={formData.rua} placeholder="Rua" onChange={handleChange} required/>
                  </div>
                  <input type="text" name="numero" value={formData.numero} placeholder="Número" className="input-simples" onChange={handleChange} required/>
                </div>
                <div className="endereco-linha-tripla">
                  <div className="input-with-icon-side">
                    <div className="icon-box-side"><i className="fas fa-map-marker-alt"></i></div>
                    <input type="text" name="bairro" value={formData.bairro} placeholder="Bairro" onChange={handleChange} required/>
                  </div>
                  <div className="input-with-icon-side">
                    <div className="icon-box-side"><i className="fas fa-globe"></i></div>
                    <input type="text" name="cidade" value={formData.cidade} placeholder="Cidade" onChange={handleChange} required/>
                  </div>
                  <input type="text" name="uf" value={formData.uf} placeholder="UF" className="input-simples" onChange={handleChange} required/>
                </div>
                <div className="input-with-icon-side">
                  <div className="icon-box-side"><i className="fas fa-location-arrow"></i></div>
                  <input type="text" name="ponto_referencia" value={formData.ponto_referencia} placeholder="Ponto de Referência" onChange={handleChange} />
                </div>
              </section>

              <section className="coleta-card agendamento-card">
                <div className="agendamento-header">
                  <h3>Agendamento</h3>
                  <div className="icon-buttons-group">
                    <div className="btn-icon-square"><i className="fas fa-calendar-alt"></i></div>
                    <div className="btn-icon-square"><i className="fas fa-clock"></i></div>
                  </div>
                </div>
                <div className="agendamento-inputs">
                  <div className="input-with-icon">
                    <div className="input-icon-box"><i className="fas fa-calendar-day"></i></div>
                    {/* Aqui eu adicionei o name e o onChange para o React conseguir ler a data! */}
                    <input type="date" name="data" value={formData.data} onChange={handleChange} required />
                  </div>
                  <div className="input-with-icon">
                    <div className="input-icon-box"><i className="fas fa-clock"></i></div>
                    {/* Aqui adicionei name, onChange e mudei pra type time */}
                    <input type="time" name="hora" value={formData.hora} onChange={handleChange} required />
                  </div>
                </div>
              </section>
            </div>
          </div>

          <button type="submit" className="btn-enviar-solicitacao">ENVIAR SOLICITAÇÃO</button>
        </form>
      </main>
    </div>
  );
};

export default SolicitarColeta;