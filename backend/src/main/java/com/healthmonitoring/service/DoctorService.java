package com.healthmonitoring.service;

import com.healthmonitoring.dto.*;
import com.healthmonitoring.entity.Doctor;
import com.healthmonitoring.entity.DoctorPatientAccess;
import com.healthmonitoring.entity.HealthProfile;
import com.healthmonitoring.entity.User;
import com.healthmonitoring.exception.AccessDeniedException;
import com.healthmonitoring.exception.ResourceNotFoundException;
import com.healthmonitoring.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DoctorPatientAccessRepository accessRepository;
    private final UserRepository userRepository;
    private final HealthProfileRepository healthProfileRepository;
    private final HealthRecordService healthRecordService;
    private final MedicationService medicationService;
    private final AppointmentRepository appointmentRepository;
    private final HealthAlertRepository alertRepository;

    @Transactional(readOnly = true)
    public List<DoctorDTO> getAllActiveDoctors() {
        return doctorRepository.findAllActiveDoctors().stream()
                .map(d -> DoctorDTO.builder()
                        .id(d.getId())
                        .userId(d.getUser().getId())
                        .fullName(d.getUser().getFullName())
                        .email(d.getUser().getEmail())
                        .avatarUrl(d.getUser().getAvatarUrl())
                        .specialty(d.getSpecialty())
                        .licenseNumber(d.getLicenseNumber())
                        .hospitalAffinity(d.getHospitalAffinity())
                        .bio(d.getBio())
                        .rating(d.getRating())
                        .experienceYears(d.getExperienceYears())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PagedResponse<DoctorPatientDTO> getDoctorPatients(Long doctorUserId, String search, int page, int size) {
        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user: " + doctorUserId));

        Pageable pageable = PageRequest.of(page, size);
        Page<User> patients = accessRepository.findPatientsByDoctorId(doctor.getId(), search, pageable);

        Page<DoctorPatientDTO> dtoPage = patients.map(patient -> {
            HealthProfile profile = healthProfileRepository.findByUserId(patient.getId()).orElse(null);
            Integer age = profile != null && profile.getDateOfBirth() != null ?
                    Period.between(profile.getDateOfBirth(), LocalDate.now()).getYears() : null;

            List<HealthRecordDTO> records = healthRecordService.getRecords(patient.getId(), null, null, 0, 1).getContent();
            HealthRecordDTO latestVitals = records.isEmpty() ? null : records.get(0);

            List<AlertDTO> activeAlerts = alertRepository.findTop5ByUserIdOrderByCreatedAtDesc(patient.getId())
                    .stream().map(a -> AlertDTO.builder()
                            .id(a.getId())
                            .alertLevel(a.getAlertLevel())
                            .metricType(a.getMetricType())
                            .triggeredValue(a.getTriggeredValue())
                            .message(a.getMessage())
                            .guidance(a.getGuidance())
                            .createdAt(a.getCreatedAt())
                            .build()).collect(Collectors.toList());

            return DoctorPatientDTO.builder()
                    .patientId(patient.getId())
                    .fullName(patient.getFullName())
                    .email(patient.getEmail())
                    .phoneNumber(patient.getPhoneNumber())
                    .avatarUrl(patient.getAvatarUrl())
                    .age(age)
                    .gender(profile != null ? profile.getGender() : null)
                    .bloodGroup(profile != null ? profile.getBloodGroup() : null)
                    .latestVitals(latestVitals)
                    .activeAlerts(activeAlerts)
                    .build();
        });

        return PagedResponse.from(dtoPage);
    }

    @Transactional(readOnly = true)
    public PatientOverviewDTO getPatientHealthOverview(Long doctorUserId, Long patientId) {
        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user: " + doctorUserId));

        // Enforce security: Access only granted patients!
        boolean hasAccess = accessRepository.existsByDoctorIdAndPatientIdAndIsActiveTrue(doctor.getId(), patientId);
        if (!hasAccess) {
            throw new org.springframework.security.access.AccessDeniedException("Doctor does not have active access permissions for patient ID: " + patientId);
        }

        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + patientId));

        HealthProfile profile = healthProfileRepository.findByUserId(patientId).orElse(null);
        UserDTO userDTO = UserDTO.builder()
                .id(patient.getId())
                .email(patient.getEmail())
                .fullName(patient.getFullName())
                .phoneNumber(patient.getPhoneNumber())
                .avatarUrl(patient.getAvatarUrl())
                .build();

        HealthProfileDTO profileDTO = profile != null ? HealthProfileDTO.builder()
                .dateOfBirth(profile.getDateOfBirth())
                .gender(profile.getGender())
                .bloodGroup(profile.getBloodGroup())
                .heightCm(profile.getHeightCm())
                .weightKg(profile.getWeightKg())
                .emergencyContactName(profile.getEmergencyContactName())
                .emergencyContactPhone(profile.getEmergencyContactPhone())
                .allergies(profile.getAllergies())
                .medicalHistory(profile.getMedicalHistory())
                .build() : null;

        List<HealthRecordDTO> records = healthRecordService.getRecords(patientId, null, null, 0, 10).getContent();
        HealthRecordDTO latestVitals = records.isEmpty() ? null : records.get(0);
        List<VitalTrendDTO> trendHistory = healthRecordService.getTrends(patientId, "30d", null, null);
        List<MedicationDTO> medications = medicationService.getMedications(patientId, "ACTIVE", null, 0, 10).getContent();

        List<AppointmentDTO> appointments = appointmentRepository.findFilteredForPatient(patientId, null, PageRequest.of(0, 10))
                .getContent().stream().map(a -> AppointmentDTO.builder()
                        .id(a.getId())
                        .doctorName(a.getDoctorName())
                        .hospitalName(a.getHospitalName())
                        .appointmentDate(a.getAppointmentDate())
                        .reason(a.getReason())
                        .status(a.getStatus())
                        .doctorNotes(a.getDoctorNotes())
                        .build()).collect(Collectors.toList());

        List<AlertDTO> alerts = alertRepository.findTop5ByUserIdOrderByCreatedAtDesc(patientId)
                .stream().map(a -> AlertDTO.builder()
                        .id(a.getId())
                        .alertLevel(a.getAlertLevel())
                        .metricType(a.getMetricType())
                        .triggeredValue(a.getTriggeredValue())
                        .message(a.getMessage())
                        .guidance(a.getGuidance())
                        .createdAt(a.getCreatedAt())
                        .build()).collect(Collectors.toList());

        return PatientOverviewDTO.builder()
                .user(userDTO)
                .profile(profileDTO)
                .latestVitals(latestVitals)
                .trendHistory(trendHistory)
                .activeMedications(medications)
                .appointments(appointments)
                .recentAlerts(alerts)
                .build();
    }

    @Transactional
    public void grantAccess(Long patientId, Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + doctorId));
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + patientId));

        DoctorPatientAccess access = accessRepository.findByDoctorIdAndPatientId(doctorId, patientId)
                .orElseGet(() -> DoctorPatientAccess.builder().doctor(doctor).patient(patient).build());

        access.setIsActive(true);
        accessRepository.save(access);
    }
}
