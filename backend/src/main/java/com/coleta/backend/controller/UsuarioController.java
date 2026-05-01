package com.coleta.backend.controller;

import com.coleta.backend.model.Coletor;
import com.coleta.backend.model.Cooperativa;
import com.coleta.backend.model.Usuario;
import com.coleta.backend.repository.ColetorRepository;
import com.coleta.backend.repository.CooperativaRepository;
import com.coleta.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    // Trouxe todos os Repositories para o topo por organização
    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private CooperativaRepository cooperativaRepository;

    @Autowired
    private ColetorRepository coletorRepository;

    // Rota 1: O Cadastro Inteligente (Separa Morador e Cooperativa)
    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrar(@RequestBody Usuario dados) {
        
        // O Java verifica a palavra exata que o React enviou
        if ("COOPERATIVA".equals(dados.getTipoUsuario())) {
            
            // Instancia a classe filha para forçar a criação na tabela cooperativa
            Cooperativa coop = new Cooperativa();
            coop.setNome(dados.getNome());
            coop.setEmail(dados.getEmail());
            coop.setDocumento(dados.getDocumento());
            coop.setSenha(dados.getSenha());
            coop.setTelefone(dados.getTelefone());
            coop.setTipoUsuario("COOPERATIVA");
            
            // Copia os dados de endereço
            coop.setCep(dados.getCep());
            coop.setRua(dados.getRua());
            coop.setNumero(dados.getNumero());
            coop.setBairro(dados.getBairro());
            coop.setCidade(dados.getCidade());
            coop.setEstado(dados.getEstado());
            
            // AQUI ESTÁ A MÁGICA: Salva usando o CooperativaRepository!
            cooperativaRepository.save(coop); 
            return ResponseEntity.ok(coop);
            
        } else {
            // Se não for cooperativa, força o tipo MORADOR e salva na tabela comum
            dados.setTipoUsuario("MORADOR");
            repository.save(dados);
            return ResponseEntity.ok(dados);
        }
    }

    // Rota 2: A Mágica do Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciais) {
        String documento = credenciais.get("documento");
        String senha = credenciais.get("senha");

        Optional<Usuario> usuarioOpt = repository.findByDocumento(documento);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (usuario.getSenha().equals(senha)) {
                return ResponseEntity.ok(usuario); 
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha incorreta!"); 
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado!"); 
        }
    }

    // Rota 3: A rota administrativa (Cooperativa cadastra Coletor)
    @PostMapping("/cooperativa/{idCoo}/cadastrar-coletor")
    public ResponseEntity<?> cadastrarFuncionario(@PathVariable Long idCoo, @RequestBody Coletor novoColetor) {
        
        Optional<Cooperativa> coopOpt = cooperativaRepository.findById(idCoo);
        
        if (coopOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Erro: Cooperativa não encontrada!");
        }

        Cooperativa cooperativa = coopOpt.get();
        
        novoColetor.setCooperativa(cooperativa); 
        novoColetor.setTipoUsuario("COLETOR");
        
        coletorRepository.save(novoColetor);
        
        return ResponseEntity.ok("Coletor cadastrado com sucesso pela empresa " + cooperativa.getNome());
    }
}