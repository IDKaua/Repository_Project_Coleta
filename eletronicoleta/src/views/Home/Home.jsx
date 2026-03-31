import React, { useEffect, useRef, useState } from 'react';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import './Home.css';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const cardsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (cardsRef.current) observer.observe(cardsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="main-wrapper">
      <main className="content-container">
        <section className="hero-section">
          <div className="hero-text">
            <i className="fas fa-recycle main-icon"></i>
            <h1>
              IMAGEM <span className="green-text">RECICLA</span>
            </h1>
            <p>Sua plataforma de gestão de resíduos eletrônicos.</p>

            <div className="scroll-indicator">
              <span>Role para explorar</span>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </section>

        <section
          ref={cardsRef}
          className={`cards-section ${isVisible ? 'fade-in-up' : 'hidden-cards'}`}
        >
          <div className="cards-grid">
            <ServiceCard
              tipo="USUÁRIO"
              icone="fa-house-user"
              desc="Solicite coletas agora."
            />
            <ServiceCard
              tipo="COOPERATIVA"
              icone="fa-building"
              desc="Gerencie sua equipe."
            />
            <ServiceCard
              tipo="COLETOR"
              icone="fa-truck-fast"
              desc="Veja suas rotas."
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;