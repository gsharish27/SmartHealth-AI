package com.healthmonitoring.repository;

import com.healthmonitoring.entity.MedicationSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationScheduleRepository extends JpaRepository<MedicationSchedule, Long> {

    List<MedicationSchedule> findByMedicationIdOrderByScheduledTimeAsc(Long medicationId);

    @Query("SELECT ms FROM MedicationSchedule ms WHERE ms.medication.user.id = :userId " +
           "AND ms.status = 'PENDING' ORDER BY ms.scheduledTime ASC")
    List<MedicationSchedule> findUpcomingSchedulesByUserId(@Param("userId") Long userId);
}
