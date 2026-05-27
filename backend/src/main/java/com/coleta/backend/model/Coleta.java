package com.coleta.backend.model;

import jakarta.persistence.GenerationType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Entity;

@Entity
public class Coleta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    private String endereco;
    private String telefone;
    private String tipoResiduo;
    private String descricao;
    private String status; // PENDENTE, EM ANDAMENTO, COLETADO

    // CAMPOS DE COORDENADAS
    private Double latitude;
    private Double longitude;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario morador;

    @ManyToOne
    @JoinColumn(name = "coletor_id")
    private Coletor coletor;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    
    public Usuario getMorador() { return morador; }
    public void setMorador(Usuario morador) { this.morador = morador; }
    
    public Coletor getColetor() { return coletor; }
    public void setColetor(Coletor coletor) { this.coletor = coletor; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getTipoResiduo() { return tipoResiduo; }
    public void setTipoResiduo(String tipoResiduo) { this.tipoResiduo = tipoResiduo; }
    
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    // GETTERS E SETTERS DAS COORDENADAS
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}