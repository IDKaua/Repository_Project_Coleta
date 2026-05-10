import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { X, ExternalLink } from 'lucide-react';
import './SobreNos.css';

const cards = [
  {
    id: 1,
    cor: '#5a9e47',
    modalCor: '#3a7a2e',
    icone: 'fa-recycle',
    titulo: 'Nossa Missão',
    desc: 'Promover a sustentabilidade e a preservação ambiental através da coleta responsável e destinação correta de resíduos eletrônicos.',
    items: ['Reduzir o impacto ambiental dos eletrônicos.', 'Incentivar a economia circular e a reciclagem.'],
    modal: {
      intro: 'Nossa missão vai além da coleta: somos agentes de transformação ambiental e social, comprometidos com um futuro mais limpo e sustentável para todos.',
      paragraphs: [
        'A Eco Tech nasceu da necessidade urgente de dar uma destinação correta aos resíduos eletrônicos que crescem a cada ano no Brasil. Acreditamos que tecnologia e meio ambiente podem coexistir de forma harmoniosa, desde que haja responsabilidade no ciclo de vida dos produtos.',
        'Trabalhamos em parceria com empresas, escolas, condomínios e prefeituras para garantir que cada equipamento coletado seja tratado com o máximo de segurança ambiental. Nossos processos seguem a Política Nacional de Resíduos Sólidos (Lei 12.305/2010), garantindo rastreabilidade e conformidade legal.',
        'Além da coleta, investimos em educação ambiental: realizamos palestras, campanhas e workshops para conscientizar a população sobre os impactos do lixo eletrônico e a importância do descarte correto.',
      ],
      destaques: [
        { icone: '🌱', texto: 'Coleta 100% ambientalmente responsável' },
        { icone: '📋', texto: 'Certificado de descarte emitido a cada coleta' },
        { icone: '🤝', texto: 'Parcerias com mais de 50 empresas locais' },
        { icone: '♻️', texto: 'Materiais reaproveitados na cadeia produtiva' },
      ],
      link: 'https://greeneletron.org.br/blog/como-o-descarte-incorreto-de-eletronicos-impacta-a-saude-e-o-meio-ambiente/',
      linkLabel: 'Saiba mais sobre descarte responsável',
    },
  },
  {
    id: 2,
    cor: '#4a7fb5',
    modalCor: '#2c5f8a',
    icone: 'fa-bullseye',
    titulo: 'Nosso Objetivo',
    desc: 'Tornar o descarte de lixo eletrônico acessível, seguro e eficiente para empresas e cidadãos em toda a nossa região.',
    items: ['Facilitar a logística de coleta segura.', 'Conscientizar a comunidade sobre o descarte verde.'],
    modal: {
      intro: 'Queremos ser a solução mais acessível e confiável para o descarte de eletrônicos, eliminando barreiras e tornando o processo simples para qualquer pessoa ou empresa.',
      paragraphs: [
        'Nossa plataforma digital foi desenvolvida para que o agendamento de coleta seja rápido e sem burocracia. Em poucos cliques, você informa o tipo de equipamento, o endereço e a data preferida — e nós cuidamos de todo o resto.',
        'Atendemos desde grandes corporações com centenas de equipamentos até cidadãos com um único celular para descartar. Acreditamos que o acesso ao descarte correto deve ser democrático, independente do volume ou do porte do cliente.',
        'Nosso objetivo de longo prazo é expandir nossa rede de coleta para cobrir toda a região, com pontos físicos de entrega, parcerias com comércios locais e uma frota dedicada de coleta domiciliar agendada.',
      ],
      destaques: [
        { icone: '📱', texto: 'Agendamento online em menos de 3 minutos' },
        { icone: '🚚', texto: 'Coleta domiciliar e empresarial' },
        { icone: '🏢', texto: 'Soluções para empresas de todos os portes' },
        { icone: '🗺️', texto: 'Mapa de pontos de coleta em expansão' },
      ],
      link: 'https://www.cnnbrasil.com.br/tecnologia/lixo-eletronico-chegou-a-nivel-recorde-entenda-o-problema/',
      linkLabel: 'Entenda o problema do lixo eletrônico',
    },
  },
  {
    id: 3,
    cor: '#d4823a',
    modalCor: '#a85e20',
    icone: 'fa-rocket',
    titulo: 'Por Que Nos Escolher',
    desc: 'Lista de pontos fortes da empresa em bullet points:',
    items: ['Coleta prática e agendada.', 'Segurança e destruição total de dados.', 'Certificação de descarte ecológico.'],
    modal: {
      intro: 'Escolher a Eco Tech é garantir que seus resíduos eletrônicos serão tratados com total responsabilidade ambiental, segurança de dados e transparência em cada etapa do processo.',
      paragraphs: [
        'Diferentemente de empresas comuns de coleta, somos especializados exclusivamente em resíduos eletrônicos. Nossa equipe é treinada para identificar, classificar e encaminhar cada tipo de equipamento para o parceiro de reciclagem mais adequado.',
        'A segurança de dados é uma de nossas principais prioridades. Todos os dispositivos de armazenamento (HDs, SSDs, pendrives, celulares) passam por destruição certificada dos dados antes de qualquer processamento, garantindo total conformidade com a LGPD.',
        'Emitimos um Certificado de Destinação Final para cada coleta realizada, documento que comprova o descarte correto e pode ser usado pelas empresas em relatórios de sustentabilidade, auditorias e certificações ambientais.',
      ],
      destaques: [
        { icone: '🔒', texto: 'Destruição certificada de dados (LGPD)' },
        { icone: '📜', texto: 'Certificado de destinação final' },
        { icone: '⭐', texto: 'Equipe especializada em e-lixo' },
        { icone: '🌿', texto: 'Zero envio para aterros ou lixões' },
      ],
      link: 'https://www.iberdrola.com/sustentabilidade/poluicao-do-solo-causas-consequencias-solucoes',
      linkLabel: 'Entenda os riscos do descarte inadequado',
    },
  },
];

const SobreNos = () => {
  const [visivel, setVisivel] = useState(false);
  const [cardsVisiveis, setCardsVisiveis] = useState([false, false, false]);
  const [modalCard, setModalCard] = useState(null);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

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

  useEffect(() => {
    const observers = cardsRef.current.map((ref, i) => {
      if (!ref) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
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

  // Bloqueia scroll do body quando modal aberto
  useEffect(() => {
    if (modalCard) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modalCard]);

  return (
    <>
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
              <button
                className="sobre-btn"
                onClick={() => setModalCard(card)}
              >
                Leia sobre
              </button>
            </div>
          </div>
        ))}
      </div>

    </section>

    {/* ── MODAL via Portal (renderiza direto no body, fora do contexto da section) ── */}
    {modalCard && ReactDOM.createPortal(
      <div className="sobre-modal-overlay" onClick={() => setModalCard(null)}>
        <div
          className="sobre-modal-content"
          onClick={e => e.stopPropagation()}
        >
          {/* Cabeçalho */}
          <div className="sobre-modal-header" style={{ background: modalCard.modalCor }}>
            <div className="sobre-modal-header-icone">
              <i className={`fas ${modalCard.icone}`}></i>
            </div>
            <h2>{modalCard.titulo}</h2>
            <button className="sobre-modal-close" onClick={() => setModalCard(null)}>
              <X size={20} />
            </button>
          </div>

          {/* Corpo */}
          <div className="sobre-modal-body">
            <p className="sobre-modal-intro">{modalCard.modal.intro}</p>

            <div className="sobre-modal-paragraphs">
              {modalCard.modal.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Destaques */}
            <div className="sobre-modal-destaques">
              {modalCard.modal.destaques.map((d, i) => (
                <div
                  key={i}
                  className="sobre-modal-destaque-item"
                  style={{ borderLeftColor: modalCard.modalCor }}
                >
                  <span className="sobre-destaque-icone">{d.icone}</span>
                  <span className="sobre-destaque-texto">{d.texto}</span>
                </div>
              ))}
            </div>

            {/* Link externo */}
            <a
              href={modalCard.modal.link}
              target="_blank"
              rel="noopener noreferrer"
              className="sobre-modal-link"
              style={{ background: modalCard.modalCor }}
            >
              {modalCard.modal.linkLabel} <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  );
};

export default SobreNos;