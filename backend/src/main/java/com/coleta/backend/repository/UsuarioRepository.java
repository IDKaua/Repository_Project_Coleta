package com.coleta.backend.repository;

import com.coleta.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Esse método vai ser a nossa base para o Login!
    Optional<Usuario> findByDocumento(String documento);
}