package com.healthmonitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDTO {

    private Long id;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private String hospitalName;
    private OffsetDateTime appointmentDate;
    private String reason;
    private String status; // UPCOMING, COMPLETED, CANCELLED
    private String doctorNotes;
    private OffsetDateTime createdAt;
}
