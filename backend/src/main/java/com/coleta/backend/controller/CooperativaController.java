package com.coleta.backend.controller;

import com.coleta.backend.model.Coletor;
import com.coleta.backend.repository.ColetorRepository;
import com.coleta.backend.repository.CooperativaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cooperativas")
@CrossOrigin(origins = "*")
public class CooperativaController {

    @Autowired
    private CooperativaRepository cooperativaRepository;

    @Autowired
    private ColetorRepository coletorRepository;

    // Rota para cadastrar um coletor na cooperativa
    @PostMapping("/{idCoop}/cadastrar-coletor")
    public ResponseEntity<?> cadastrarColetor(@PathVariable Long idCoop, @RequestBody Coletor novoColetor) {
        return cooperativaRepository.findById(idCoop).map(coop -> {
            novoColetor.setCooperativa(coop); // Vincula o coletor à empresa
            novoColetor.setTipoUsuario("COLETOR");
            coletorRepository.save(novoColetor);
            return ResponseEntity.ok("Coletor " + novoColetor.getNome() + " cadastrado com sucesso!");
        }).orElse(ResponseEntity.notFound().build());
    }

    // 2. Rota para a Cooperativa ver a lista de todos os SEUS coletores
    @GetMapping("/{idCoop}/meus-coletores")
    public ResponseEntity<List<Coletor>> listarMeusColetores(@PathVariable Long idCoop) {
        // Aqui o Java busca no banco apenas quem trabalha para essa Cooperativa específica
        List<Coletor> lista = coletorRepository.findByCooperativaId(idCoop);
        return ResponseEntity.ok(lista);
    }   
}
