package com.coleta.backend.controller;

import com.coleta.backend.model.Coleta;
import com.coleta.backend.repository.ColetaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/coletas")
@CrossOrigin(origins = "*")
public class ColetaController {

    @Autowired
    private ColetaRepository coletaRepository;

    // Rota para SALVAR (Obrigatória para o Postman)
    @PostMapping
    public Coleta salvar(@RequestBody Coleta coleta) {
        return coletaRepository.save(coleta);
    }

    // Suas rotas antigas mantidas
    @GetMapping("/all")
    public List<Coleta> getAllColetas() {
        return coletaRepository.findAll();
    }

    @GetMapping
    public List<Coleta> getColetasByName(@RequestParam String nome) {
        return coletaRepository.findAll().stream()
                .filter(coleta -> coleta.getNome().equalsIgnoreCase(nome))
                .toList();
    }
}