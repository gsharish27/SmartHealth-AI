package com.health.system.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDto {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialty;
    private String hospitalClinic;

    @NotNull(message = "Appointment date/time is required")
    private LocalDateTime appointmentDate;

    private String reason;
    private String status; // SCHEDULED, COMPLETED, CANCELLED
    private String notes;
    private LocalDateTime createdAt;
}
