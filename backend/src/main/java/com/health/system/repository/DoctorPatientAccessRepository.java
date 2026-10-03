package com.health.system.repository;

import com.health.system.entity.DoctorPatientAccess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorPatientAccessRepository extends JpaRepository<DoctorPatientAccess, Long> {
    List<DoctorPatientAccess> findByDoctorIdAndStatus(Long doctorId, String status);
    Optional<DoctorPatientAccess> findByDoctorIdAndPatientId(Long doctorId, Long patientId);

    @Query("SELECT dpa FROM DoctorPatientAccess dpa JOIN FETCH dpa.patient p WHERE dpa.doctor.id = :doctorId AND dpa.status = 'ACTIVE'")
    List<DoctorPatientAccess> findActivePatientsForDoctor(Long doctorId);
}
