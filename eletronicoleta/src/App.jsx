import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header'; 
import SolicitarColeta from './views/SolicitarColeta/SolicitarColeta';
import Home from './views/Home/Home';
import Login from './views/Login/Login'; 
import Cadastro from './views/Login/Cadastro'; 
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
      </Routes>
    </Router>
  );
}

export default App;