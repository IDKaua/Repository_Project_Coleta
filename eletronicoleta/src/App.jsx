import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header'; 
import SolicitarColeta from './views/SolicitarColeta/SolicitarColeta';
import Home from './views/Home/Home';
import Login from './views/Login/Login'; 
import Cadastro from './views/Login/Cadastro'; 
import Rastreio from './views/Rastreio/Rastreio'; // <--- 1. ADICIONE ESTE IMPORT
import PainelCooperativa from './views/Painel-Cooperativa/PainelCooperativa'
import ContaCooperativa from './views/MinhaConta/ContaCooperativa';
import MapaCooperativa from './views/Mapa-cooperativa/MapaCooperativa';
import MinhaConta from './views/MinhaConta/MinhaConta';


import './App.css';

function App() {
  return (
    <Router>
      <Header /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/solicitar-coleta" element={<SolicitarColeta />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/rastreio" element={<Rastreio />} /> {/* <--- 2. ADICIONE ESTA ROTA */}
        <Route path="/painel-cooperativa" element={<PainelCooperativa />} />
        <Route path="/conta-cooperativa" element={<ContaCooperativa />} />
        <Route path="/mapa-cooperativa" element={<MapaCooperativa />} />
        <Route path="/minha-conta" element={<MinhaConta />} />
        
        
        
      </Routes>
    </Router>
  );
}

export default App;