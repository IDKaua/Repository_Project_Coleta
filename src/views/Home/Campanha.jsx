import React, { useEffect, useRef } from 'react';
import { Leaf, Droplets, AlertTriangle, Recycle, ArrowRight } from 'lucide-react';
import './Campanha.css';

// ─────────────────────────────────────────────────────────────
//  IMAGENS DOS CARDS
//  Fonte: Unsplash (licença gratuita, sem direitos autorais)
//  Para trocar: substitua a URL da propriedade `image` do card
//  desejado. Recomendado: 400×300 px ou proporção 4:3.
//  Você também pode usar caminhos locais: "/images/solo.jpg"
// ─────────────────────────────────────────────────────────────
const campanhaCards = [
  {
    title: "Contaminação do solo",
    icon: <Leaf className="icon-green" size={24} />,
    text: "O descarte incorreto de eletrônicos libera metais pesados que podem contaminar o solo e prejudicar plantas, animais e a qualidade da terra.",
    colorClass: "card-green",
    animClass: "slide-from-left",
    // 🔄 TROCAR IMAGEM: substitua a URL abaixo
    image: "https://media.istockphoto.com/id/2239333382/pt/foto/silage-losses-by-effluent-waste-management-silage-caused-by-high-moisture-content-in-ensiled.webp?a=1&b=1&s=612x612&w=0&k=20&c=YhgU1ThzJ1mv69E457lA--9SH8cZqRcwRqULlkNK90k=",
    imageAlt: "Solo rachado e seco representando contaminação do solo",
  },
  {
    title: "Poluição da água",
    icon: <Droplets className="icon-blue" size={24} />,
    text: "Componentes eletrônicos podem liberar substâncias tóxicas que atingem rios e lençóis freáticos, afetando a vida aquática.",
    colorClass: "card-blue",
    animClass: "slide-from-right",
    // 🔄 TROCAR IMAGEM: substitua a URL abaixo
    image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400&h=300&fit=crop&auto=format",
    imageAlt: "Água poluída com coloração alterada",
  },
  {
    title: "Riscos à saúde humana",
    icon: <AlertTriangle className="icon-red" size={24} />,
    text: "A exposição a resíduos eletrônicos pode causar problemas à saúde, pois muitos dispositivos possuem materiais químicos perigosos.",
    colorClass: "card-red",
    animClass: "slide-from-left",
    // 🔄 TROCAR IMAGEM: substitua a URL abaixo
    image: "https://media.istockphoto.com/id/1059369662/pt/foto/man-coughing-into-his-fist-isolated-on-a-gray-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=OK1BpVwFO9Kt9wJZDXhGWktYMYZYsT9nVOjyZmRLoDI=",
    imageAlt: "Equipamento de proteção e risco químico",
  },
  {
    title: "Acúmulo de lixo eletrônico",
    icon: <Recycle className="icon-gray" size={24} />,
    text: "O crescimento do descarte de eletrônicos aumenta a quantidade de lixo no meio ambiente e desperdiça materiais recicláveis.",
    colorClass: "card-gray",
    animClass: "slide-from-right",
    // 🔄 TROCAR IMAGEM: substitua a URL abaixo
    image: "https://images.unsplash.com/photo-1585896452718-89b5b66a5a6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bGl4byUyMGVsZXRyb25pY28lMjBubyUyMG1laW8lMjBhbWJpZW50ZXxlbnwwfHwwfHx8MA%3D%3D",
    imageAlt: "Placa de circuito eletrônico — lixo eletrônico",
  },
];

const Campanha = () => {
  const gridRef = useRef(null);

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

  return (
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
                  {/* Fallback exibido se a imagem não carregar */}
                  <div className="card-image-fallback">
                    {card.icon}
                  </div>
                </div>

                <p>{card.text}</p>
              </div>

              <button className="btn-leia-mais">
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
  );
};

export default Campanha;