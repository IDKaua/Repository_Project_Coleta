package com.coleta.backend.controller;

import com.coleta.backend.model.Coleta;
import com.coleta.backend.model.Usuario;
import com.coleta.backend.repository.ColetaRepository;
import com.coleta.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/coletas")
@CrossOrigin(origins = "*")
public class ColetaController {

    @Autowired
    private ColetaRepository coletaRepository;

    // Adicionamos o repositório de usuários aqui!
    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/solicitar/{usuarioId}")
    public ResponseEntity<?> solicitarColeta(@PathVariable Long usuarioId, @RequestBody Coleta coleta) {
        
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioId);

        if (usuarioOpt.isPresent()) {
            Usuario morador = usuarioOpt.get();

            // A trava de segurança!
            boolean temColetaEmAndamento = coletaRepository.existsByMoradorAndStatusNot(morador, "COLETADO");

            if (temColetaEmAndamento) {
                return ResponseEntity.status(400).body("Erro: Você já possui uma coleta em andamento. Aguarde a finalização para solicitar outra.");
            }

            coleta.setMorador(morador);
            coleta.setStatus("PENDENTE"); 

            Coleta coletaSalva = coletaRepository.save(coleta);
            return ResponseEntity.ok(coletaSalva);
        }

        return ResponseEntity.status(404).body("Erro: Morador não encontrado!");
    }

    @GetMapping("/all")
    public List<Coleta> getAllColetas() {
        return coletaRepository.findAll();
    }
}