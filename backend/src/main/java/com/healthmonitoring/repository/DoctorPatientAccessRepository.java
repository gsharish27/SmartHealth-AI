package com.healthmonitoring.repository;

import com.healthmonitoring.entity.DoctorPatientAccess;
import com.healthmonitoring.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorPatientAccessRepository extends JpaRepository<DoctorPatientAccess, Long> {

    Optional<DoctorPatientAccess> findByDoctorIdAndPatientId(Long doctorId, Long patientId);

    boolean existsByDoctorIdAndPatientIdAndIsActiveTrue(Long doctorId, Long patientId);

    @Query("SELECT dpa.patient FROM DoctorPatientAccess dpa " +
           "WHERE dpa.doctor.id = :doctorId AND dpa.isActive = true " +
           "AND (:search IS NULL OR LOWER(dpa.patient.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(dpa.patient.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> findPatientsByDoctorId(@Param("doctorId") Long doctorId, @Param("search") String search, Pageable pageable);

    @Query("SELECT dpa FROM DoctorPatientAccess dpa WHERE dpa.patient.id = :patientId AND dpa.isActive = true")
    List<DoctorPatientAccess> findActiveDoctorAccessByPatientId(@Param("patientId") Long patientId);
}
