import React, { useEffect, useRef, useState } from 'react';
import './SobreNos.css';

const cards = [
  {
    id: 1,
    cor: '#5a9e47',
    icone: 'fa-recycle',
    titulo: 'Nossa Missão',
    desc: 'Promover a sustentabilidade e a preservação ambiental através da coleta responsável e destinação correta de resíduos eletrônicos.',
    items: ['Reduzir o impacto ambiental dos eletrônicos.', 'Incentivar a economia circular e a reciclagem.'],
  },
  {
    id: 2,
    cor: '#4a7fb5',
    icone: 'fa-bullseye',
    titulo: 'Nosso Objetivo',
    desc: 'Tornar o descarte de lixo eletrônico acessível, seguro e eficiente para empresas e cidadãos em toda a nossa região.',
    items: ['Facilitar a logística de coleta segura.', 'Conscientizar a comunidade sobre o descarte verde.'],
  },
  {
    id: 3,
    cor: '#d4823a',
    icone: 'fa-rocket',
    titulo: 'Por Que Nos Escolher',
    desc: 'Lista de pontos fortes da empresa em bullet points:',
    items: ['Coleta prática e agendada.', 'Segurança e destruição total de dados.', 'Certificação de descarte ecológico.'],
  },
];

const SobreNos = () => {
  const [visivel, setVisivel] = useState(false);
  const [cardsVisiveis, setCardsVisiveis] = useState([false, false, false]);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  // Animação da seção inteira (título + nome)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisivel(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Animação individual de cada card ao scrollar
  useEffect(() => {
    const observers = cardsRef.current.map((ref, i) => {
      if (!ref) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Dispara com delay escalonado
            setTimeout(() => {
              setCardsVisiveis(prev => {
                const novo = [...prev];
                novo[i] = true;
                return novo;
              });
            }, i * 200);
            obs.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      obs.observe(ref);
      return obs;
    });

    return () => observers.forEach(obs => obs?.disconnect());
  }, []);

  return (
    <section id="sobre" ref={sectionRef} className={`sobre-section ${visivel ? 'sobre-visivel' : ''}`}>
      <div className="sobre-header">
        <h2 className="sobre-titulo">SOBRE NÓS</h2>
        <p className="sobre-desc">
          "Somos uma empresa dedicada à gestão inteligente e reciclagem de resíduos eletrônicos.
          Nossa missão é liderar a transição para uma economia circular, garantindo que a tecnologia
          obsoleta não se torne um problema ambiental. Utilizamos uma abordagem 100% sustentável,
          segura e transparente para minimizar o impacto na natureza, promovendo o descarte
          consciente e a reciclagem responsável de componentes eletrônicos."
        </p>
      </div>

      <h3 className="sobre-nome">
        ECO <span>TECH</span>
      </h3>

      <div className="sobre-cards">
        {cards.map((card, i) => (
          <div
            key={card.id}
            ref={el => (cardsRef.current[i] = el)}
            className={`sobre-card ${cardsVisiveis[i] ? 'card-visivel' : ''}`}
            style={{ background: card.cor }}
          >
            <div className="sobre-card-header">
              <div className="sobre-card-icone">
                <i className={`fas ${card.icone}`}></i>
              </div>
              <h4>{card.titulo}</h4>
            </div>

            <p className="sobre-card-desc">{card.desc}</p>
            <hr className="sobre-card-divider" />

            <ul className="sobre-card-lista">
              {card.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <div className="sobre-card-footer">
              <button className="sobre-btn">Leia sobre</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SobreNos;