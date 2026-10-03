package com.health.system.service;

import com.health.system.dto.*;
import com.health.system.entity.Doctor;
import com.health.system.entity.DoctorPatientAccess;
import com.health.system.entity.User;
import com.health.system.exception.ResourceNotFoundException;
import com.health.system.repository.DoctorPatientAccessRepository;
import com.health.system.repository.DoctorRepository;
import com.health.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DoctorPatientAccessRepository accessRepository;
    private final UserRepository userRepository;
    private final ProfileService profileService;
    private final HealthRecordService healthRecordService;
    private final MedicationService medicationService;
    private final AlertService alertService;

    @Transactional(readOnly = true)
    public List<PatientOverviewDto> getAssignedPatients(Long doctorUserId) {
        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseGet(() -> doctorRepository.findAll().stream().findFirst().orElse(null));

        if (doctor == null) {
            return List.of();
        }

        List<DoctorPatientAccess> accesses = accessRepository.findActivePatientsForDoctor(doctor.getId());
        return accesses.stream()
                .map(acc -> getPatientOverview(acc.getPatient().getId()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PatientOverviewDto getPatientOverview(Long patientId) {
        UserProfileDto profile = profileService.getProfile(patientId);
        List<VitalSummaryDto> summaries = healthRecordService.getDashboardVitalSummaries(patientId);
        List<HealthAlertDto> alerts = alertService.getUserAlerts(patientId);
        List<MedicationDto> medications = medicationService.getUserMedications(patientId);

        return PatientOverviewDto.builder()
                .patientId(patientId)
                .fullName(profile.getFullName())
                .email(profile.getEmail())
                .phone(profile.getPhone())
                .age(profile.getAge())
                .gender(profile.getGender())
                .bloodGroup(profile.getBloodGroup())
                .vitalSummaries(summaries)
                .activeAlerts(alerts)
                .activeMedications(medications)
                .build();
    }
}
