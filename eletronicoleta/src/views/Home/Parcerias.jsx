import React, { useEffect, useRef, useState } from 'react';
import './Parcerias.css';

const grupo1 = [
  { nome: 'SESI SENAI', bg: '#d0e8f5', texto: '#1a5a8a', label: 'SESI|SENAI' },
  { nome: 'Gerdau',     bg: '#f5c200', texto: '#003087', label: 'GO GERDAU' },
  { nome: 'Grau',       bg: '#5aaa3a', texto: '#ffffff', label: 'grau técnico' },
  { nome: 'Walmart',    bg: '#ffffff', texto: '#0071ce', label: 'Walmart ✦' },
];

const grupo2 = [
  { nome: 'Shopee',  bg: '#ffffff', texto: '#ee4d2d', label: '🛍 Shopee' },
  { nome: 'C&A',     bg: '#ffffff', texto: '#003087', label: 'C&A' },
  { nome: 'Natura',  bg: '#ffffff', texto: '#2e7d32', label: '🌿 natura' },
  { nome: 'Nestlé',  bg: '#ffffff', texto: '#c8102e', label: '🌺 Nestlé' },
];

const Parcerias = () => {
  const [grupoAtivo, setGrupoAtivo] = useState(0); // 0 = grupo1, 1 = grupo2
  const [animando, setAnimando] = useState(false);
  const [visivel, setVisivel] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer para animação de entrada
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisivel(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Loop de alternância entre grupos
  useEffect(() => {
    const intervalo = setInterval(() => {
      setAnimando(true);
      setTimeout(() => {
        setGrupoAtivo(prev => (prev === 0 ? 1 : 0));
        setAnimando(false);
      }, 600); // tempo do fade-out antes de trocar
    }, 3000); // troca a cada 3s

    return () => clearInterval(intervalo);
  }, []);

  const grupos = [grupo1, grupo2];
  const atual = grupos[grupoAtivo];

  return (
    <section id="parceiros" ref={sectionRef} className={`parcerias-section ${visivel ? 'parcerias-visivel' : ''}`}>
      <h2 className="parcerias-titulo">Empresas parceiras da <span>EcoTech</span></h2>
      <p className="parcerias-desc">
        Com a <strong>EcoTech</strong>, os utilizadores podem acumular pontos com ações sustentáveis
        e trocá-los por descontos exclusivos. Converta os seus pontos em vantagens e aproveite
        benefícios especiais.
      </p>

      <div className={`parcerias-logos ${animando ? 'logos-saindo' : 'logos-entrando'}`}>
        {atual.map((empresa) => (
          <div
            key={empresa.nome}
            className="parceria-logo"
            style={{ background: empresa.bg, color: empresa.texto }}
          >
            <span>{empresa.label}</span>
          </div>
        ))}
      </div>

      {/* Indicadores de grupo */}
      <div className="parcerias-dots">
        <span className={`dot ${grupoAtivo === 0 ? 'dot-ativo' : ''}`} />
        <span className={`dot ${grupoAtivo === 1 ? 'dot-ativo' : ''}`} />
      </div>
    </section>
  );
};

export default Parcerias;