package com.coleta.backend.repository;

import com.coleta.backend.model.Coletor;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ColetorRepository extends JpaRepository<Coletor, Long> {

    List<Coletor> findByCooperativaId(Long cooperativaId);
    
    // Busca coletor pelo CPF (documento)
    Optional<Coletor> findByDocumento(String documento);
    
}
