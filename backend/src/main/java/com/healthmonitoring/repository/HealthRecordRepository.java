package com.healthmonitoring.repository;

import com.healthmonitoring.entity.HealthRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {

    @Query("SELECT hr FROM HealthRecord hr WHERE hr.user.id = :userId " +
           "AND (:startDate IS NULL OR hr.recordedAt >= :startDate) " +
           "AND (:endDate IS NULL OR hr.recordedAt <= :endDate) " +
           "ORDER BY hr.recordedAt DESC")
    Page<HealthRecord> findByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") OffsetDateTime startDate,
            @Param("endDate") OffsetDateTime endDate,
            Pageable pageable
    );

    @Query("SELECT hr FROM HealthRecord hr WHERE hr.user.id = :userId " +
           "AND (:startDate IS NULL OR hr.recordedAt >= :startDate) " +
           "AND (:endDate IS NULL OR hr.recordedAt <= :endDate) " +
           "ORDER BY hr.recordedAt ASC")
    List<HealthRecord> findTrendsByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") OffsetDateTime startDate,
            @Param("endDate") OffsetDateTime endDate
    );

    Optional<HealthRecord> findFirstByUserIdOrderByRecordedAtDesc(Long userId);

    @Query("SELECT hr FROM HealthRecord hr WHERE hr.user.id = :userId " +
           "ORDER BY hr.recordedAt DESC")
    List<HealthRecord> findTop2ByUserIdOrderByRecordedAtDesc(@Param("userId") Long userId, Pageable pageable);
}
