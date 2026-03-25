import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header/Header';
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
      { threshold: 0.2 } 
    );

    if (cardsRef.current) observer.observe(cardsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`main-wrapper ${isVisible ? 'scrolled' : ''}`}>
      {/* O Header fica aqui, fora do <main> para ser global */}
      <Header />
      
      <div className="bg-layer bg-primary"></div>
      <div className="bg-layer bg-secondary"></div>

      <main className="content-container">
        <section className="hero-section">
          <div className="hero-text">
            <i className="fas fa-recycle main-icon"></i>
            <h1>IMAGEM <span className="green-text">RECICLA</span></h1>
            <p>Sua plataforma de gestão de resíduos eletrônicos.</p>
            <div className="scroll-indicator">
               <span>Role para explorar</span>
               <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </section>
        
        <div 
          ref={cardsRef} 
          className={`cards-grid ${isVisible ? 'fade-in-up' : 'hidden-cards'}`}
        >
          <ServiceCard tipo="MORADOR" icone="fa-house-user" desc="Solicite coletas agora." />
          <ServiceCard tipo="COOPERATIVA" icone="fa-building" desc="Gerencie sua equipe." />
          <ServiceCard tipo="COLETOR" icone="fa-truck-fast" desc="Veja suas rotas." />
        </div>
      </main>
    </div>
  );
};

export default Home;