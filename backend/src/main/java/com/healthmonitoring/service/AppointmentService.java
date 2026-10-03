package com.healthmonitoring.service;

import com.healthmonitoring.dto.AppointmentDTO;
import com.healthmonitoring.dto.AppointmentRequest;
import com.healthmonitoring.dto.PagedResponse;
import com.healthmonitoring.entity.Appointment;
import com.healthmonitoring.entity.Doctor;
import com.healthmonitoring.entity.User;
import com.healthmonitoring.exception.ResourceNotFoundException;
import com.healthmonitoring.repository.AppointmentRepository;
import com.healthmonitoring.repository.DoctorRepository;
import com.healthmonitoring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    @Transactional
    public AppointmentDTO bookAppointment(Long patientId, AppointmentRequest request) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + patientId));

        Doctor doctor = null;
        if (request.getDoctorId() != null) {
            doctor = doctorRepository.findById(request.getDoctorId()).orElse(null);
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .doctorName(request.getDoctorName())
                .hospitalName(request.getHospitalName())
                .appointmentDate(request.getAppointmentDate())
                .reason(request.getReason())
                .status("UPCOMING")
                .build();

        Appointment saved = appointmentRepository.save(appointment);
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public PagedResponse<AppointmentDTO> getPatientAppointments(Long patientId, String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Appointment> appPage = appointmentRepository.findFilteredForPatient(patientId, status, pageable);
        return PagedResponse.from(appPage.map(this::mapToDTO));
    }

    @Transactional(readOnly = true)
    public List<AppointmentDTO> getUpcomingAppointments(Long patientId) {
        return appointmentRepository.findUpcomingAppointmentsByPatientId(patientId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentDTO updateStatus(Long appointmentId, String status, String doctorNotes) {
        Appointment app = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + appointmentId));

        if (status != null) app.setStatus(status.toUpperCase());
        if (doctorNotes != null) app.setDoctorNotes(doctorNotes);

        Appointment updated = appointmentRepository.save(app);
        return mapToDTO(updated);
    }

    @Transactional
    public void cancelAppointment(Long appointmentId, Long patientId) {
        Appointment app = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + appointmentId));

        if (!app.getPatient().getId().equals(patientId)) {
            throw new ResourceNotFoundException("Appointment not found for user: " + appointmentId);
        }

        app.setStatus("CANCELLED");
        appointmentRepository.save(app);
    }

    public AppointmentDTO mapToDTO(Appointment app) {
        return AppointmentDTO.builder()
                .id(app.getId())
                .patientId(app.getPatient().getId())
                .patientName(app.getPatient().getFullName())
                .doctorId(app.getDoctor() != null ? app.getDoctor().getId() : null)
                .doctorName(app.getDoctorName())
                .hospitalName(app.getHospitalName())
                .appointmentDate(app.getAppointmentDate())
                .reason(app.getReason())
                .status(app.getStatus())
                .doctorNotes(app.getDoctorNotes())
                .createdAt(app.getCreatedAt())
                .build();
    }
}
