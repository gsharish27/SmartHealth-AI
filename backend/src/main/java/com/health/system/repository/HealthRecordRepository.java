package com.health.system.repository;

import com.health.system.entity.HealthRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {

    @Query("SELECT r FROM HealthRecord r WHERE r.user.id = :userId AND r.recordedAt BETWEEN :startDate AND :endDate ORDER BY r.recordedAt ASC")
    List<HealthRecord> findByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT r FROM HealthRecord r WHERE r.user.id = :userId AND " +
           "(:search IS NULL OR LOWER(r.notes) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:startDate IS NULL OR r.recordedAt >= :startDate) AND " +
           "(:endDate IS NULL OR r.recordedAt <= :endDate)")
    Page<HealthRecord> searchRecords(
            @Param("userId") Long userId,
            @Param("search") String search,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );

    Optional<HealthRecord> findFirstByUserIdOrderByRecordedAtDesc(Long userId);

    @Query(value = "SELECT * FROM health_records WHERE user_id = :userId ORDER BY recordedAt DESC LIMIT 2", nativeQuery = true)
    List<HealthRecord> findTop2ByUserIdOrderByRecordedAtDescNative(@Param("userId") Long userId);
}
