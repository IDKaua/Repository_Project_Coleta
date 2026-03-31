import React from 'react';
import Swal from 'sweetalert2';
import './ServiceCard.css';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ tipo, icone, desc }) => {
  const navigate = useNavigate();
  const handleAccess = () => {
    if (tipo === "USUÁRIO") {
      navigate('/solicitar-coleta');
    } else {
      // Lógica para os outros cards
    }
  };

  return (
    <div className="service-card">
      <div className="card-icon-box">
        <i className={`fas ${icone}`}></i>
      </div>
      <h3>{tipo}</h3>
      <p>{desc}</p>
      <button onClick={handleAccess} className="btn-acessar">
        ACESSAR
      </button>
    </div>
  );
};

export default ServiceCard;