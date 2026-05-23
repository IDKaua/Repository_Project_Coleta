import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import SolicitarColeta from "./views/SolicitarColeta/SolicitarColeta";
import Home from "./views/Home/Home";
import Login from "./views/Login/Login";
import Cadastro from "./views/Login/Cadastro";
import Rastreio from "./views/Rastreio/Rastreio";
import PainelCooperativa from "./views/Painel-Cooperativa/PainelCooperativa";
import ContaCooperativa from "./views/Conta-Cooperativa/ContaCooperativa";
import MapaCooperativa from "./views/Mapa-cooperativa/MapaCooperativa";
import MinhaConta from "./views/MinhaConta/MinhaConta";
import Coletor from "./views/Coletor/Coletor";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas protegidas - Usuário/Morador */}
        <Route
          path="/solicitar-coleta"
          element={
            <ProtectedRoute
              element={<SolicitarColeta />}
              requiredUserType="MORADOR"
            />
          }
        />
        <Route
          path="/rastreio"
          element={
            <ProtectedRoute element={<Rastreio />} requiredUserType="MORADOR" />
          }
        />
        <Route
          path="/minha-conta"
          element={
            <ProtectedRoute
              element={<MinhaConta />}
              requiredUserType="MORADOR"
            />
          }
        />
        <Route
          path="/mapa-cooperativa"
          element={
            <ProtectedRoute
              element={<MapaCooperativa />}
              requiredUserType="MORADOR"
            />
          }
        />

        {/* Rotas protegidas - Cooperativa */}
        <Route
          path="/painel-cooperativa"
          element={
            <ProtectedRoute
              element={<PainelCooperativa />}
              requiredUserType="COOPERATIVA"
            />
          }
        />
        <Route
          path="/conta-cooperativa"
          element={
            <ProtectedRoute
              element={<ContaCooperativa />}
              requiredUserType="COOPERATIVA"
            />
          }
        />

        {/* Rotas protegidas - Coletor */}
        <Route
          path="/coletor"
          element={
            <ProtectedRoute element={<Coletor />} requiredUserType="COLETOR" />
          }
        />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        theme="colored"
      />
    </Router>
  );
}

export default App;
