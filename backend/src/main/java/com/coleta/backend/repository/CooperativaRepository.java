package com.coleta.backend.repository;

import com.coleta.backend.model.Cooperativa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CooperativaRepository extends JpaRepository<Cooperativa, Long> {
    
}
