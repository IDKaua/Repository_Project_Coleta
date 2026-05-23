package com.coleta.backend.controller;

import com.coleta.backend.model.Coletor;
import com.coleta.backend.model.Cooperativa;
import com.coleta.backend.model.Usuario;
import com.coleta.backend.repository.ColetorRepository;
import com.coleta.backend.repository.CooperativaRepository;
import com.coleta.backend.repository.UsuarioRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cooperativas")
@CrossOrigin(origins = "*")
public class CooperativaController {

    @Autowired
    private CooperativaRepository cooperativaRepository;

    @Autowired
    private ColetorRepository coletorRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PersistenceContext
    private EntityManager entityManager;

    // Rota para cadastrar um coletor na cooperativa
    @PostMapping("/{idCoop}/cadastrar-coletor")
    @Transactional
    public ResponseEntity<?> cadastrarColetor(@PathVariable Long idCoop, @RequestBody Coletor novoColetor) {

        // 1. Tenta buscar a cooperativa normalmente (tabela JOINED)
        Optional<Cooperativa> coopOpt = cooperativaRepository.findById(idCoop);

        if (!coopOpt.isPresent()) {
            // 2. Fallback: verifica se existe como Usuario com tipo COOPERATIVA
            Optional<Usuario> userOpt = usuarioRepository.findById(idCoop);

            if (userOpt.isPresent() && "COOPERATIVA".equals(userOpt.get().getTipoUsuario())) {
                // Insere diretamente na tabela cooperativa via SQL nativo
                // (o JPA JOINED inheritance impede fazer isso via save() normal)
                entityManager.createNativeQuery(
                    "INSERT INTO cooperativa (id) VALUES (:id)")
                    .setParameter("id", idCoop)
                    .executeUpdate();
                entityManager.flush();
                entityManager.clear();

                // Agora busca normalmente — a entrada JOINED foi criada
                coopOpt = cooperativaRepository.findById(idCoop);
            }
        }

        if (!coopOpt.isPresent()) {
            return ResponseEntity.status(404).body("Erro: Cooperativa com ID " + idCoop + " não encontrada no sistema.");
        }

        try {
            novoColetor.setCooperativa(coopOpt.get());
            novoColetor.setTipoUsuario("COLETOR");
            Coletor salvo = coletorRepository.save(novoColetor);
            return ResponseEntity.ok("Coletor " + salvo.getNome() + " cadastrado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao salvar coletor: " + e.getMessage());
        }
    }

    // 2. Rota para a Cooperativa ver a lista de todos os SEUS coletores
    @GetMapping("/{idCoop}/meus-coletores")
    public ResponseEntity<List<Coletor>> listarMeusColetores(@PathVariable Long idCoop) {
        // Aqui o Java busca no banco apenas quem trabalha para essa Cooperativa específica
        List<Coletor> lista = coletorRepository.findByCooperativaId(idCoop);
        return ResponseEntity.ok(lista);
    }
}
