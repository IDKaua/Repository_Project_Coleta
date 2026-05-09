import React, { useEffect, useRef, useState } from 'react';
import './Funcoes.css';

const funcoes = [
  {
    id: 1,
    lado: 'direita',
    icone: 'fa-clipboard-check',
    titulo: 'Agende sua coleta',
    desc: 'Informe o tipo de equipamento, a quantidade e o endereço de coleta, além da variedade de resíduos eletrônicos, para que possamos realizar a gestão e o descarte correto de forma sustentável..',
  },
  {
    id: 2,
    lado: 'esquerda',
    icone: 'fa-chart-line',
    titulo: 'Status e Triagem',
    desc: 'Acompanhe todo o processo do seu lixo eletrônico em tempo real. Após a coleta, os itens passam por uma triagem onde são identificados, classificados e encaminhados para o destino correto, garantindo um descarte seguro e sustentável..',
  },
  {
    id: 3,
    lado: 'direita',
    icone: 'fa-bullseye',
    titulo: 'Acumule pontos',
    desc: 'A cada coleta realizada, você ganha pontos que podem ser acumulados em sua conta. Quanto mais você contribui com o descarte correto de resíduos eletrônicos, mais pontos recebe. Depois, é possível trocar esses pontos por descontos e benefícios exclusivos em nossas empresas parceiras..',
  },
  {
    id: 4,
    lado: 'esquerda',
    icone: 'fa-map-marked-alt',
    titulo: 'Mapa e Histórico',
    desc: 'Visualize no mapa os pontos de coleta disponíveis e acompanhe no histórico todos os seus descartes realizados, mantendo controle completo da sua contribuição para um meio ambiente mais limpo..',
  },
];

const Funcoes = () => {
  const [visiveis, setVisiveis] = useState(funcoes.map(() => false));
  const refsCards = useRef([]);

  useEffect(() => {
    const observers = refsCards.current.map((ref, i) => {
      if (!ref) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisiveis(prev => {
              const novo = [...prev];
              novo[i] = true;
              return novo;
            });
            obs.disconnect();
          }
        },
        { threshold: 0.25 }
      );
      obs.observe(ref);
      return obs;
    });

    return () => observers.forEach(obs => obs?.disconnect());
  }, []);

  return (
    <section id="funcoes" className="funcoes-section">

      {/* Título */}
      <h2 className="funcoes-titulo">FUNÇÕES</h2>

      <div className="funcoes-lista">
        {funcoes.map((item, i) => (
          <div
            key={item.id}
            ref={el => (refsCards.current[i] = el)}
            className={`funcao-card lado-${item.lado} ${visiveis[i] ? 'funcao-visivel' : ''}`}
          >
            {/* Layout: ícone à esquerda se lado=direita, à direita se lado=esquerda */}
            {item.lado === 'direita' && (
              <div className="funcao-icone">
                <i className={`fas ${item.icone}`} />
              </div>
            )}

            <div className={`funcao-texto ${item.lado === 'esquerda' ? 'texto-direita' : ''}`}>
              <h3>{item.titulo}</h3>
              <p>{item.desc}</p>
            </div>

            {item.lado === 'esquerda' && (
              <div className="funcao-icone">
                <i className={`fas ${item.icone}`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Funcoes;