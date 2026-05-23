import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceCard from "../../components/ServiceCard/ServiceCard";
import Campanha from "./Campanha";
import Parcerias from "./Parcerias";
import Funcoes from "./Funcoes"; // ← novo import
import SobreNos from "./SobreNos";
import Footer from "./Footer";
import "./Home.css";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [campanhasVisible, setCampanhasVisible] = useState(false);
  const cardsRef = useRef(null);
  const campanhasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    if (cardsRef.current) observer.observe(cardsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCampanhasVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    if (campanhasRef.current) observer.observe(campanhasRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="main-wrapper">
      <main className="content-container">
        <section id="home" className="hero-section">
          <div className="hero-text">
            <i className="fas fa-recycle main-icon"></i>
            <h1>
              ECO <span className="green-text">TECH</span>
            </h1>
            <p>Sua plataforma de gestão de resíduos eletrônicos.</p>
            <div className="scroll-indicator">
              <span>Role para explorar</span>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </section>

        <section
          id="servicos"
          ref={cardsRef}
          className={`cards-section ${isVisible ? "fade-in-up" : "hidden-cards"}`}
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

        <Parcerias />

        {/* Funções aparece APÓS Parcerias e ANTES de Campanhas */}
        <Funcoes />

        <section id="campanha" ref={campanhasRef} className="campanhas-section">
          <h2
            className={`campanhas-title ${campanhasVisible ? "title-visible" : ""}`}
          >
            CAMPANHAS
          </h2>
          <Campanha />
        </section>

        <SobreNos />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
