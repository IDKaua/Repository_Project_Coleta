import React from "react";

const Agendamento = ({ formData, handleChange }) => (
  <section className="coleta-card">
    <div className="agendamento-header">
      <h3>Agendamento</h3>
      <div className="header-icons">
        <div className="icon-box-small"><i className="fas fa-calendar-alt"></i></div>
        <div className="icon-box-small"><i className="fas fa-clock"></i></div>
      </div>
    </div>

    <div className="input-row">
      <div className="input-with-icon-side field-full">
        <div className="icon-box-side"><i className="fas fa-calendar-alt"></i></div>
        <input type="date" name="data" value={formData.data} onChange={handleChange} required />
      </div>
      <div className="input-with-icon-side field-full">
        <div className="icon-box-side"><i className="fas fa-clock"></i></div>
        <input type="time" name="hora" value={formData.hora} onChange={handleChange} required />
      </div>
    </div>
  </section>
);

export default Agendamento;