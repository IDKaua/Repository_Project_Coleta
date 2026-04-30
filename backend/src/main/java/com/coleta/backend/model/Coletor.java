package com.coleta.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Coletor extends Usuario {
    // A classe Coletor herda os atributos de Usuario
    private String cnh;
    private String placaVeiculo;
    
    @ManyToOne
    @JoinColumn(name = "cooperativa_id")
    private Cooperativa cooperativa; // Relacionamento com a cooperativa à qual o coletor pertence

    public String getCnh() { return cnh; }
    public void setCnh(String cnh) { this.cnh = cnh; }
    public String getPlacaVeiculo() { return placaVeiculo; }
    public void setPlacaVeiculo(String placaVeiculo) { this.placaVeiculo = placaVeiculo; }
    public Cooperativa getCooperativa() { return cooperativa; }
    public void setCooperativa(Cooperativa cooperativa) { this.cooperativa = cooperativa; }
}
