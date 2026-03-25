import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SolicitarColeta from './views/SolicitarColeta/SolicitarColeta';
import Home from './views/Home/Home';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/solicitar-coleta" element={<SolicitarColeta />} />
      </Routes>
    </Router>
  );
}

export default App;