package com.coleta.backend.model;

import jakarta.persistence.Entity;

@Entity
public class Cooperativa extends Usuario {
    
    private String cnpjDaEmpresa; // Exemplo de dado exclusivo dela

    // Getters e Setters
    public String getCnpjDaEmpresa() { return cnpjDaEmpresa; }
    public void setCnpjDaEmpresa(String cnpjDaEmpresa) { this.cnpjDaEmpresa = cnpjDaEmpresa; }
}