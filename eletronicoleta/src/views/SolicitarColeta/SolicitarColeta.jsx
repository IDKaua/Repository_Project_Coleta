import React, { useState } from 'react';
import './SolicitarColeta.css';

const SolicitarColeta = () => {
  const [formData, setFormData] = useState({
    tipo_residuo: 'Computadores',
    quantidade: 1,
    porte: 'Pequeno', // Estado para controlar qual porte está selecionado
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

  // Função para alterar o porte selecionado
  const selecionarPorte = (tamanho) => {
    setFormData(prev => ({ ...prev, porte: tamanho }));
  };

  return (
    <div className="coleta-wrapper">
      <main className="coleta-container">
        <h1 className="titulo-sessao">NOVA SOLICITAÇÃO DE COLETA</h1>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* Card de Fotos (Layout Centralizado + Direita) */}
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
            {/* INFORMAÇÕES DO LIXO */}
            <section className="coleta-card">
              <h3>Informações do Lixo</h3>
              <div className="info-lixo-row">
  <div className="input-item tipo-equipamento">
    <label><i className="fas fa-desktop"></i> Tipo de Equipamento</label>
    <select name="tipo_residuo">
      <option>🖥️ Computadores</option>
      <option>📱 Celulares</option>
      <option>⌨️ Periféricos</option>
      <option>🎰 Eletrodomésticos</option>
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

              {/* SELETOR DE PORTE DINÂMICO */}
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
              {/* ENDEREÇO DA COLETA (RESTAURADO) */}
              <section className="coleta-card">
                <h3>Endereço da Coleta</h3>
                <div className="input-with-icon-side">
                  <div className="icon-box-side"><i className="fas fa-user"></i></div>
                  <input type="text" name="nome_solicitante" placeholder="Nome do Solicitante" onChange={handleChange} />
                </div>
                <div className="input-with-icon-side">
                  <div className="icon-box-side"><i className="fas fa-user"></i></div>
                  <input type="text" name="cep" placeholder="CEP" onChange={handleChange} />
                </div>
                <div className="endereco-linha-dupla">
                  <div className="input-with-icon-side flex-grow">
                    <div className="icon-box-side"><i className="fas fa-home"></i></div>
                    <input type="text" name="rua" placeholder="Rua" onChange={handleChange} />
                  </div>
                  <input type="text" name="numero" placeholder="Número" className="input-simples" onChange={handleChange} />
                </div>
                <div className="endereco-linha-tripla">
                  <div className="input-with-icon-side">
                    <div className="icon-box-side"><i className="fas fa-map-marker-alt"></i></div>
                    <input type="text" name="bairro" placeholder="Bairro" onChange={handleChange} />
                  </div>
                  <div className="input-with-icon-side">
                    <div className="icon-box-side"><i className="fas fa-globe"></i></div>
                    <input type="text" name="cidade" placeholder="Cidade" onChange={handleChange} />
                  </div>
                  <input type="text" name="uf" placeholder="UF" className="input-simples" onChange={handleChange} />
                </div>
                <div className="input-with-icon-side">
                  <div className="icon-box-side"><i className="fas fa-map-marker-alt"></i></div>
                  <input type="text" name="ponto_referencia" placeholder="Ponto de Referência" onChange={handleChange} />
                </div>
              </section>

              {/* AGENDAMENTO */}
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
                    <input type="text" placeholder="Data" />
                  </div>
                  <div className="input-with-icon">
                    <div className="input-icon-box"><i className="fas fa-clock"></i></div>
                    <input type="text" placeholder="Hora" />
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