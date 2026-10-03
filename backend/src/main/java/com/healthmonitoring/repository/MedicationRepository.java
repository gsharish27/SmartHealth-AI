package com.healthmonitoring.repository;

import com.healthmonitoring.entity.Medication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, Long> {

    Page<Medication> findByUserId(Long userId, Pageable pageable);

    List<Medication> findByUserIdAndStatus(Long userId, String status);

    @Query("SELECT m FROM Medication m WHERE m.user.id = :userId " +
           "AND (:status IS NULL OR m.status = :status) " +
           "AND (:search IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Medication> findFiltered(@Param("userId") Long userId, @Param("status") String status, @Param("search") String search, Pageable pageable);
}
