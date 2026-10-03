package com.healthmonitoring.repository;

import com.healthmonitoring.entity.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    Page<Appointment> findByPatientId(Long patientId, Pageable pageable);

    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId " +
           "AND (:status IS NULL OR a.status = :status) " +
           "ORDER BY a.appointmentDate DESC")
    Page<Appointment> findFilteredForPatient(@Param("patientId") Long patientId, @Param("status") String status, Pageable pageable);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId " +
           "ORDER BY a.appointmentDate DESC")
    Page<Appointment> findFilteredForDoctor(@Param("doctorId") Long doctorId, Pageable pageable);

    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId " +
           "AND a.status = 'UPCOMING' ORDER BY a.appointmentDate ASC")
    List<Appointment> findUpcomingAppointmentsByPatientId(@Param("patientId") Long patientId);
}
