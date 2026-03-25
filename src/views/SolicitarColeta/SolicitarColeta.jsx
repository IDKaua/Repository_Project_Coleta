import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import './SolicitarColeta.css';

const SolicitarColeta = () => {
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
    data_agendamento: '',
    hora_agendamento: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const alterarQuantidade = (valor) => {
    setFormData(prev => ({ ...prev, quantidade: Math.max(1, prev.quantidade + valor) }));
  };

  return (
    <div className="coleta-wrapper">
      <Header />
      <main className="coleta-container">
        <nav className="breadcrumb">Início &gt; Solicitar Coleta</nav>
        <h1 className="titulo-sessao">NOVA SOLICITAÇÃO DE COLETA</h1>

        <form onSubmit={(e) => { e.preventDefault(); console.log(formData); }}>
          
          <section className="coleta-card upload-card">
            <div className="upload-section">
              <div className="upload-info">
                <i className="fas fa-camera main-upload-icon"></i>
                <h3>Anexar Fotos</h3>
                <p>Anexe até 3 fotos do lixo eletrônico para ajudar na triagem</p>
              </div>
              <div className="photo-placeholders">
                <div className="box-upload"><i className="fas fa-image"></i></div>
                <div className="box-upload"><i className="fas fa-image"></i></div>
                <div className="box-upload"><i className="fas fa-image"></i></div>
              </div>
            </div>
          </section>

          <div className="coleta-grid">
            {/* Lado Esquerdo: Info do Lixo - ALINHADO */}
            <section className="coleta-card">
              <h3>Informações do Lixo</h3>
              
              <div className="info-lixo-row">
                <div className="input-item flex-grow">
                  <label><i className="fas fa-desktop"></i> Tipo de Equipamento</label>
                  <select name="tipo_residuo" value={formData.tipo_residuo} onChange={handleChange}>
                    <option value="Computadores">Computadores</option>
                    <option value="Celulares">Celulares</option>
                    <option value="Perifericos">Periféricos</option>
                  </select>
                </div>

                <div className="input-item">
                  <label><i className="fas fa-boxes"></i> Quantidade</label>
                  <div className="contador-container">
                    <button type="button" onClick={() => alterarQuantidade(-1)}>-</button>
                    <input 
                      type="number" 
                      name="quantidade" 
                      value={formData.quantidade} 
                      readOnly
                    />
                    <button type="button" onClick={() => alterarQuantidade(1)}>+</button>
                  </div>
                </div>
              </div>

              <div className="porte-container-info">
                <label><i className="fas fa-weight-hanging"></i> Porte da Coleta</label>
                <div className="porte-selector">
                  {['Pequeno', 'Médio', 'Grande'].map((p) => (
                    <button 
                      key={p}
                      type="button" 
                      className={`porte-btn ${formData.porte === p ? 'active' : 'inactive'}`} 
                      onClick={() => setFormData({...formData, porte: p})}
                    >
                      <i className={`fas ${p === 'Pequeno' ? 'fa-mobile-alt' : p === 'Médio' ? 'fa-laptop' : 'fa-tv'}`}></i>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Lado Direito: Endereço (COMPLETO) e Calendário */}
            <section className="coleta-card">
              <h3>Endereço da Coleta</h3>
              <div className="form-group"><input type="text" name="nome_solicitante" placeholder="Nome do Solicitante" onChange={handleChange} /></div>
              
              <div className="endereco-linha-dupla">
                <input type="text" name="cep" placeholder="CEP" onChange={handleChange} />
                <input type="text" name="numero" placeholder="Nº" onChange={handleChange} />
              </div>

              <div className="form-group"><input type="text" name="rua" placeholder="Rua / Logradouro" onChange={handleChange} /></div>

              <div className="endereco-linha-tripla">
                <input type="text" name="bairro" placeholder="Bairro" onChange={handleChange} />
                <input type="text" name="cidade" placeholder="Cidade" onChange={handleChange} />
                <input type="text" name="uf" placeholder="UF" onChange={handleChange} />
              </div>
              
              <div className="agendamento-box">
                <h4><i className="fas fa-calendar-alt"></i> Sugestão de Agendamento</h4>
                <div className="agendamento-inputs">
                  <input type="date" name="data_agendamento" className="input-calendario" onChange={handleChange} />
                  <input type="time" name="hora_agendamento" className="input-hora" onChange={handleChange} />
                </div>
              </div>
            </section>
          </div>

          <button type="submit" className="btn-enviar-solicitacao">ENVIAR SOLICITAÇÃO</button>
        </form>
      </main>
    </div>
  );
};

export default SolicitarColeta;