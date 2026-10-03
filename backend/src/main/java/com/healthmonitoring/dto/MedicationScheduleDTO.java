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
public class MedicationScheduleDTO {

    private Long id;
    private Long medicationId;
    private String medicationName;
    private String dosage;
    private OffsetDateTime scheduledTime;
    private String status; // PENDING, TAKEN, SKIPPED
    private OffsetDateTime takenAt;
    private String notes;
}
