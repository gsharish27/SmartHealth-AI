package com.healthmonitoring.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentRequest {

    private Long doctorId;

    @NotBlank(message = "Doctor name is required")
    private String doctorName;

    @NotBlank(message = "Hospital / Clinic name is required")
    private String hospitalName;

    @NotNull(message = "Appointment date is required")
    private OffsetDateTime appointmentDate;

    @NotBlank(message = "Reason for appointment is required")
    private String reason;

    private String status;
    private String doctorNotes;
}
