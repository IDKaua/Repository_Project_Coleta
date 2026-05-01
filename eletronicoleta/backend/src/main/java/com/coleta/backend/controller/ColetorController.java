package com.coleta.backend.controller;

import com.coleta.backend.repository.ColetorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coletores")
@CrossOrigin(origins = "*")
public class ColetorController {

    @Autowired
    private ColetorRepository coletorRepository;

    // Rota para o coletor ver os dados dele e de qual empresa ele é
    @GetMapping("/{id}")
    public ResponseEntity<?> verPerfil(@PathVariable Long id) {
        return coletorRepository.findById(id)
                .map(coletor -> ResponseEntity.ok(coletor))
                .orElse(ResponseEntity.notFound().build());
    }
}