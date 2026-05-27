package com.coleta.backend.repository;

import com.coleta.backend.model.Coleta;
import com.coleta.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ColetaRepository extends JpaRepository<Coleta, Long> {

    // Método para verificar se existe uma coleta ativa para um morador específico
    boolean existsByMoradorAndStatusNot(Usuario morador, String status);

    // Busca coletas atribuídas a um coletor que ainda não foram finalizadas
    List<Coleta> findByColetorIdAndStatusNot(Long coletorId, String status);

    // Busca todas as coletas de um coletor
    List<Coleta> findByColetorId(Long coletorId);
}