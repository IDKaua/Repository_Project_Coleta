import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Leaf, Droplets, AlertTriangle, Recycle, ArrowRight, X, ExternalLink } from 'lucide-react';
import './Campanha.css';

const campanhaCards = [
  {
    title: "Contaminação do solo",
    icon: <Leaf className="icon-green" size={24} />,
    text: "O descarte incorreto de eletrônicos libera metais pesados que podem contaminar o solo e prejudicar plantas, animais e a qualidade da terra.",
    colorClass: "card-green",
    modalColor: "#2e7d32",
    animClass: "slide-from-left",
    image: "https://media.istockphoto.com/id/2239333382/pt/foto/silage-losses-by-effluent-waste-management-silage-caused-by-high-moisture-content-in-ensiled.webp?a=1&b=1&s=612x612&w=0&k=20&c=YhgU1ThzJ1mv69E457lA--9SH8cZqRcwRqULlkNK90k=",
    imageAlt: "Solo rachado e seco representando contaminação do solo",
    newsUrl: "https://www.iberdrola.com/sustentabilidade/poluicao-do-solo-causas-consequencias-solucoes",
    details: {
      intro: "A poluição do solo é um dos problemas ambientais mais graves causados pelo descarte incorreto de resíduos eletrônicos no Brasil e no mundo.",
      paragraphs: [
        "Equipamentos eletrônicos como celulares, computadores e baterias contêm substâncias altamente tóxicas: chumbo, mercúrio, cádmio, arsênio e retardantes de chama bromados. Quando descartados em lixões ou aterros comuns, esses materiais se decompõem e infiltram o solo, tornando-o infértil e perigoso.",
        "O solo contaminado perde sua capacidade de sustentar vida vegetal e animal. Microrganismos essenciais para a fertilidade são destruídos, e as toxinas migram para lençóis freáticos, contaminando também a água que abastece comunidades inteiras.",
        "No Brasil, estima-se que mais de 2,4 milhões de toneladas de lixo eletrônico são geradas por ano — e grande parte ainda não tem destinação adequada, comprometendo extensas áreas de solo em todo o território nacional.",
      ],
      stats: [
        { label: "Toneladas/ano de lixo eletrônico no Brasil", value: "2,4 mi" },
        { label: "Tempo para o chumbo se degradar no solo", value: "+100 anos" },
        { label: "Substâncias tóxicas em 1 celular", value: "+30" },
      ],
      tips: [
        "Nunca jogue eletrônicos no lixo comum.",
        "Procure pontos de coleta seletiva de eletrônicos.",
        "Prefira empresas com logística reversa certificada.",
      ],
    },
  },
  {
    title: "Poluição da água",
    icon: <Droplets className="icon-blue" size={24} />,
    text: "Componentes eletrônicos podem liberar substâncias tóxicas que atingem rios e lençóis freáticos, afetando a vida aquática.",
    colorClass: "card-blue",
    modalColor: "#1565c0",
    animClass: "slide-from-right",
    image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400&h=300&fit=crop&auto=format",
    imageAlt: "Água poluída com coloração alterada",
    newsUrl: "https://www.todamateria.com.br/poluicao-da-agua/",
    details: {
      intro: "A poluição da água por resíduos eletrônicos é um problema silencioso que afeta ecossistemas, animais e seres humanos, muitas vezes sem que as pessoas percebam.",
      paragraphs: [
        "Metais pesados provenientes de baterias, placas de circuito e telas LCD se dissolvem quando em contato com a umidade do solo e chegam aos rios, lagos e lençóis freáticos. O mercúrio, por exemplo, se transforma em metilmercúrio — uma das substâncias mais tóxicas para organismos aquáticos e humanos.",
        "Peixes e outros animais aquáticos absorvem essas toxinas, que se acumulam na cadeia alimentar — fenômeno chamado de bioacumulação. Quando consumidos por humanos, podem causar danos neurológicos, renais e hepáticos graves.",
        "No Brasil, comunidades que dependem de rios e poços artesianos próximos a lixões informais estão expostas a altos riscos. A qualidade da água potável está diretamente ligada à forma como descartamos nossos eletrônicos.",
      ],
      stats: [
        { label: "Rios brasileiros com contaminação por metais pesados", value: "Milhares" },
        { label: "Volume de mercúrio em lâmpadas fluorescentes", value: "3–5 mg" },
        { label: "Pessoas afetadas por água contaminada no mundo", value: "+2 bi" },
      ],
      tips: [
        "Não descarte baterias e pilhas no lixo comum.",
        "Entregue lâmpadas fluorescentes em pontos de coleta.",
        "Apoie iniciativas de reciclagem de eletrônicos na sua cidade.",
      ],
    },
  },
  {
    title: "Riscos à saúde humana",
    icon: <AlertTriangle className="icon-red" size={24} />,
    text: "A exposição a resíduos eletrônicos pode causar problemas à saúde, pois muitos dispositivos possuem materiais químicos perigosos.",
    colorClass: "card-red",
    modalColor: "#c62828",
    animClass: "slide-from-left",
    image: "https://media.istockphoto.com/id/1059369662/pt/foto/man-coughing-into-his-fist-isolated-on-a-gray-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=OK1BpVwFO9Kt9wJZDXhGWktYMYZYsT9nVOjyZmRLoDI=",
    imageAlt: "Equipamento de proteção e risco químico",
    newsUrl: "https://greeneletron.org.br/blog/como-o-descarte-incorreto-de-eletronicos-impacta-a-saude-e-o-meio-ambiente/",
    details: {
      intro: "O contato com resíduos eletrônicos representa sérios riscos à saúde humana, especialmente para trabalhadores informais de reciclagem e comunidades próximas a lixões.",
      paragraphs: [
        "Substâncias como chumbo, mercúrio, cádmio e BFRs (retardantes de chama bromados) presentes em eletrônicos são altamente tóxicas para o organismo humano. A exposição pode ocorrer por inalação de vapores, contato com a pele ou ingestão indireta via alimentos e água contaminados.",
        "Crianças são especialmente vulneráveis: o chumbo afeta o desenvolvimento neurológico, causando redução de QI, déficit de atenção e problemas de comportamento. Segundo a OMS, mais de 12 milhões de crianças são afetadas pelo lixo eletrônico no mundo.",
        "Trabalhadores que desmontam eletrônicos sem proteção adequada ficam expostos a altos níveis de toxinas. No Brasil, grande parte da desmontagem ainda ocorre de forma informal, sem equipamentos de segurança ou ventilação adequada.",
      ],
      stats: [
        { label: "Crianças afetadas pelo lixo eletrônico no mundo", value: "12 mi" },
        { label: "Substâncias cancerígenas em placas eletrônicas", value: "+10" },
        { label: "Trabalhadores informais no setor de e-lixo", value: "Milhões" },
      ],
      tips: [
        "Nunca queime eletrônicos — libera gases tóxicos.",
        "Use luvas ao manusear baterias danificadas.",
        "Leve sempre seus aparelhos a centros de reciclagem certificados.",
      ],
    },
  },
  {
    title: "Acúmulo de lixo eletrônico",
    icon: <Recycle className="icon-gray" size={24} />,
    text: "O crescimento do descarte de eletrônicos aumenta a quantidade de lixo no meio ambiente e desperdiça materiais recicláveis.",
    colorClass: "card-gray",
    modalColor: "#424242",
    animClass: "slide-from-right",
    image: "https://images.unsplash.com/photo-1585896452718-89b5b66a5a6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bGl4byUyMGVsZXRyb25pY28lMjBubyUyMG1laW8lMjBhbWJpZW50ZXxlbnwwfHwwfHx8MA%3D%3D",
    imageAlt: "Placa de circuito eletrônico — lixo eletrônico",
    newsUrl: "https://www.cnnbrasil.com.br/tecnologia/lixo-eletronico-chegou-a-nivel-recorde-entenda-o-problema/",
    details: {
      intro: "O volume global de lixo eletrônico cresce a um ritmo alarmante. O Brasil é o maior gerador da América Latina e um dos maiores do mundo.",
      paragraphs: [
        "Em 2022, o mundo gerou 62 milhões de toneladas de resíduos eletrônicos — quantidade suficiente para encher 1,55 milhão de caminhões de lixo. Estima-se que esse número chegue a 82 milhões de toneladas em 2030, impulsionado pela obsolescência programada e pelo crescente consumo de tecnologia.",
        "O Brasil gera aproximadamente 2,4 milhões de toneladas de e-lixo por ano, mas recicla apenas uma pequena fração. Muito desse material contém ouro, prata, cobre e lítio — materiais preciosos que poderiam ser recuperados e reinseridos na cadeia produtiva, reduzindo a necessidade de mineração.",
        "A falta de infraestrutura de coleta e reciclagem, aliada à baixa conscientização da população, resulta no acúmulo de aparelhos obsoletos em gavetas e, posteriormente, no descarte inadequado. A Política Nacional de Resíduos Sólidos (Lei 12.305/2010) prevê a logística reversa obrigatória, mas sua implementação ainda é desafiadora.",
      ],
      stats: [
        { label: "Lixo eletrônico gerado no mundo em 2022", value: "62 mi t" },
        { label: "Brasil no ranking mundial de e-lixo", value: "Top 5" },
        { label: "Projeção mundial de e-lixo em 2030", value: "82 mi t" },
      ],
      tips: [
        "Doe ou venda eletrônicos que ainda funcionam.",
        "Prefira reparar a substituir aparelhos com defeito.",
        "Pesquise pontos de coleta de eletrônicos na sua cidade.",
      ],
    },
  },
];

const Campanha = () => {
  const gridRef = useRef(null);
  const [modalCard, setModalCard] = useState(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            grid.querySelectorAll('.row-1').forEach(card => card.classList.add('collide'));
            grid.querySelectorAll('.row-2').forEach(card => card.classList.add('collide'));
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(grid);
    return () => observer.disconnect();
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
      <section className="campanha-section">
      <header className="campanha-header">
        <h2>CAMPANHA DE CONSCIENTIZAÇÃO</h2>
        <p>Conheça os impactos da poluição de resíduos eletrônicos no meio ambiente:</p>
      </header>

      <div className="campanha-grid" ref={gridRef}>
        {campanhaCards.map((card, index) => {
          const rowClass = index < 2 ? 'row-1' : 'row-2';
          return (
            <div
              key={index}
              className={`campanha-card ${card.colorClass} ${card.animClass} ${rowClass}`}
            >
              <div className="campanha-card-header">
                {card.icon}
                <h3>{card.title}</h3>
              </div>

              <div className="campanha-card-body">
                <div className="card-image-wrapper">
                  <img
                    src={card.image}
                    alt={card.imageAlt}
                    className="card-image"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="card-image-fallback">
                    {card.icon}
                  </div>
                </div>

                <p>{card.text}</p>
              </div>

              <button
                className="btn-leia-mais"
                onClick={() => setModalCard(card)}
              >
                Leia sobre <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <footer className="campanha-footer">
        <p>Conscientize-se: uma sociedade unida contra a poluição é mais forte e capaz de proteger o meio ambiente para as futuras gerações.</p>
      </footer>
    </section>

    {/* ── MODAL via Portal (renderiza direto no body, fora do contexto da section) ── */}
    {modalCard && ReactDOM.createPortal(
      <div className="modal-overlay" onClick={() => setModalCard(null)}>
        <div
          className="modal-content"
          onClick={e => e.stopPropagation()}
        >
          {/* Cabeçalho do modal */}
          <div className="modal-header" style={{ background: modalCard.modalColor }}>
            <div className="modal-header-icon">{modalCard.icon}</div>
            <h2>{modalCard.title}</h2>
            <button className="modal-close" onClick={() => setModalCard(null)}>
              <X size={22} />
            </button>
          </div>

          {/* Imagem */}
          <div className="modal-image-wrapper">
            <img
              src={modalCard.image}
              alt={modalCard.imageAlt}
              className="modal-image"
              onError={e => e.currentTarget.style.display = 'none'}
            />
          </div>

          {/* Corpo */}
          <div className="modal-body">
            <p className="modal-intro">{modalCard.details.intro}</p>

            <div className="modal-paragraphs">
              {modalCard.details.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Estatísticas */}
            <div className="modal-stats">
              {modalCard.details.stats.map((stat, i) => (
                <div key={i} className="modal-stat-item" style={{ borderColor: modalCard.modalColor }}>
                  <span className="modal-stat-value" style={{ color: modalCard.modalColor }}>{stat.value}</span>
                  <span className="modal-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Dicas */}
            <div className="modal-tips">
              <h4>💡 O que você pode fazer:</h4>
              <ul>
                {modalCard.details.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>

            {/* Link externo */}
            <a
              href={modalCard.newsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-source-link"
              style={{ background: modalCard.modalColor }}
            >
              Saiba mais <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  );
};

export default Campanha;