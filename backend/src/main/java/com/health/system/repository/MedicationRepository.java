package com.health.system.repository;

import com.health.system.entity.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, Long> {
    List<Medication> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Medication> findByUserIdAndStatus(Long userId, String status);
}
