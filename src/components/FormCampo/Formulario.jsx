import React from 'react';
import "./FormCampo.css"

const Campo = ({ label, name, type = "text", required = false, value, onChange, erro, className = "" }) => (
  <div className={`campo-form-end ${className}`}>
    <label>{label}{required && " *"}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={erro ? "input-erro" : ""}
    />
    {erro && <span className="erro-campo">{erro}</span>}
  </div>
);

export default Campo;