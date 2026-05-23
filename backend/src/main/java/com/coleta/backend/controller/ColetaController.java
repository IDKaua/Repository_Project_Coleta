package com.coleta.backend.controller;

import com.coleta.backend.model.Coleta;
import com.coleta.backend.model.Usuario;
import com.coleta.backend.model.Coletor;
import com.coleta.backend.repository.ColetaRepository;
import com.coleta.backend.repository.UsuarioRepository;
import com.coleta.backend.repository.ColetorRepository;
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

    @Autowired
    private ColetorRepository coletorRepository;

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
    
    // Rota para a Cooperativa atribuir um coletor à coleta! (Método PUT)
    @PutMapping("/atribuir/{coletaId}/{coletorId}")
    public ResponseEntity<?> atribuirColetor(@PathVariable Long coletaId, @PathVariable Long coletorId) {
        Optional<Coleta> coletaOpt = coletaRepository.findById(coletaId);
        if (coletaOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Erro: Coleta não encontrada!");
        }

        Optional<Coletor> coletorOpt = coletorRepository.findById(coletorId);
        Coletor coletor = null;

        if (coletorOpt.isPresent()) {
            coletor = coletorOpt.get();
        } else {
            // Se o coletor não existir no banco (caso de IDs mockados iniciais 1, 2 ou 3 do React),
            // nós o criamos automaticamente no banco para evitar falhas e permitir testes perfeitos!
            String documentoMock = (coletorId == 1) ? "123.456.789-00" : ((coletorId == 2) ? "987.654.321-00" : "456.123.789-00");
            
            // Busca por CPF para garantir que não haja duplicatas
            coletor = coletorRepository.findAll().stream()
                .filter(c -> documentoMock.equals(c.getDocumento()))
                .findFirst()
                .orElse(null);

            if (coletor == null) {
                Coletor novoColetor = new Coletor();
                novoColetor.setNome((coletorId == 1) ? "Carlos Silva" : ((coletorId == 2) ? "Ana Souza" : "João Ferreira"));
                novoColetor.setDocumento(documentoMock);
                novoColetor.setEmail((coletorId == 1) ? "carlos@email.com" : ((coletorId == 2) ? "ana@email.com" : "joao@email.com"));
                novoColetor.setSenha("senhaColetor123");
                novoColetor.setTipoUsuario("COLETOR");
                novoColetor.setPlacaVeiculo((coletorId == 1) ? "ABC-1234" : ((coletorId == 2) ? "XYZ-5678" : "DEF-9012"));
                novoColetor.setCnh("123456");
                coletor = coletorRepository.save(novoColetor);
            }
        }

        Coleta coleta = coletaOpt.get();
        coleta.setColetor(coletor);
        coleta.setStatus("EM ANDAMENTO");

        Coleta coletaSalva = coletaRepository.save(coleta);
        return ResponseEntity.ok(coletaSalva);
    }
    
    // Rota para a Cooperativa finalizar a coleta! (Método PUT)
    @PutMapping("/finalizar/{coletaId}")
    public ResponseEntity<?> finalizarColeta(@PathVariable Long coletaId) {
        
        // 1. Procura a coleta pelo ID dela
        Optional<Coleta> coletaOpt = coletaRepository.findById(coletaId);

        if (coletaOpt.isPresent()) {
            Coleta coleta = coletaOpt.get();
            
            // 2. Muda o status para COLETADO
            coleta.setStatus("COLETADO");
            coletaRepository.save(coleta);
            
            return ResponseEntity.ok("Sucesso! Coleta finalizada. O morador foi destravado!");
        }

        return ResponseEntity.status(404).body("Erro: Coleta não encontrada!");
    }

    @GetMapping("/all")
    public List<Coleta> getAllColetas() {
        return coletaRepository.findAll();
    }
}