package com.coleta.backend.repository;

import com.coleta.backend.model.Coleta;
import com.coleta.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColetaRepository extends JpaRepository<Coleta, Long> {

    // Método para verificar se existe uma coleta ativa para um morador específico
    boolean existsByMoradorAndStatusNot(Usuario morador, String status);
}