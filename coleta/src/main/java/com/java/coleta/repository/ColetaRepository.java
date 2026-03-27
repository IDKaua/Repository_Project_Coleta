package com.java.coleta.repository;

import com.java.coleta.model.Coleta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColetaRepository extends JpaRepository<Coleta, Long> {
    
}
