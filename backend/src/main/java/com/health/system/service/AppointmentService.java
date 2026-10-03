package com.health.system.service;

import com.health.system.dto.AppointmentDto;
import com.health.system.entity.Appointment;
import com.health.system.entity.Doctor;
import com.health.system.entity.User;
import com.health.system.exception.ResourceNotFoundException;
import com.health.system.repository.AppointmentRepository;
import com.health.system.repository.DoctorRepository;
import com.health.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    @Transactional(readOnly = true)
    public List<AppointmentDto> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientIdOrderByAppointmentDateDesc(patientId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentDto scheduleAppointment(Long patientId, AppointmentDto dto) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient user not found"));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId() != null ? dto.getDoctorId() : 1L)
                .orElseGet(() -> doctorRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("No doctors available in clinic")));

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(dto.getAppointmentDate())
                .reason(dto.getReason())
                .status("SCHEDULED")
                .notes(dto.getNotes())
                .build();

        Appointment saved = appointmentRepository.save(appointment);
        return mapToDto(saved);
    }

    @Transactional
    public void cancelAppointment(Long appointmentId, Long patientId) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        if (appt.getPatient().getId().equals(patientId)) {
            appt.setStatus("CANCELLED");
            appointmentRepository.save(appt);
        }
    }

    private AppointmentDto mapToDto(Appointment appt) {
        return AppointmentDto.builder()
                .id(appt.getId())
                .patientId(appt.getPatient().getId())
                .patientName(appt.getPatient().getFullName())
                .doctorId(appt.getDoctor().getId())
                .doctorName(appt.getDoctor().getUser().getFullName())
                .doctorSpecialty(appt.getDoctor().getSpecialty())
                .hospitalClinic(appt.getDoctor().getHospitalClinic())
                .appointmentDate(appt.getAppointmentDate())
                .reason(appt.getReason())
                .status(appt.getStatus())
                .notes(appt.getNotes())
                .createdAt(appt.getCreatedAt())
                .build();
    }
}
