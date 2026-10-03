package com.healthmonitoring.repository;

import com.healthmonitoring.entity.HealthAlert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthAlertRepository extends JpaRepository<HealthAlert, Long> {

    Page<HealthAlert> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @Query("SELECT ha FROM HealthAlert ha WHERE ha.user.id = :userId " +
           "AND (:level IS NULL OR ha.alertLevel = :level) " +
           "ORDER BY ha.createdAt DESC")
    Page<HealthAlert> findFiltered(@Param("userId") Long userId, @Param("level") String level, Pageable pageable);

    List<HealthAlert> findTop5ByUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserIdAndIsReadFalse(Long userId);
}
