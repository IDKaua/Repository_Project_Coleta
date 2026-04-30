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

    @Autowired
    private UsuarioRepository repository;

    // Rota 1: O Cadastro que você já testou e funcionou
    @PostMapping("/cadastrar")
    public Usuario cadastrar(@RequestBody Usuario usuario) {
        return repository.save(usuario);
    }

    // Rota 2: A Mágica do Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciais) {
        String documento = credenciais.get("documento");
        String senha = credenciais.get("senha");

        // Vai no banco de dados e procura se existe alguém com esse CPF/CNPJ
        Optional<Usuario> usuarioOpt = repository.findByDocumento(documento);

        // Se encontrou o usuário...
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // Confere se a senha que veio no Postman é igual a que está salva no banco
            if (usuario.getSenha().equals(senha)) {
                return ResponseEntity.ok(usuario); // Sucesso! Devolve os dados do usuário.
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha incorreta!"); // Erro 401
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado!"); // Erro 404
        }
    }
    @Autowired
    private CooperativaRepository cooperativaRepository;

    @Autowired
    private ColetorRepository coletorRepository;

    // 2. A rota administrativa
    @PostMapping("/cooperativa/{idCoo}/cadastrar-coletor")
    public ResponseEntity<?> cadastrarFuncionario(@PathVariable Long idCoo, @RequestBody Coletor novoColetor) {
        
        // Verifica se a empresa realmente existe no banco
        Optional<Cooperativa> coopOpt = cooperativaRepository.findById(idCoo);
        
        if (coopOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Erro: Cooperativa não encontrada!");
        }

        // Pega a cooperativa de dentro do Optional
        Cooperativa cooperativa = coopOpt.get();
        
        // Amarra o funcionário à empresa e define o tipo
        novoColetor.setCooperativa(cooperativa); 
        novoColetor.setTipoUsuario("COLETOR");
        
        // Salva na nuvem!
        coletorRepository.save(novoColetor);
        
        return ResponseEntity.ok("Coletor cadastrado com sucesso pela empresa " + cooperativa.getNome());
    }
}