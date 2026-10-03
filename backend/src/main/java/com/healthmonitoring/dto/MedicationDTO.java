package com.healthmonitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicationDTO {

    private Long id;
    private Long userId;
    private String name;
    private String dosage;
    private String frequency;
    private LocalDate startDate;
    private LocalDate endDate;
    private String prescribedBy;
    private String status; // ACTIVE, COMPLETED, PAUSED
    private String notes;
    private OffsetDateTime nextDose;
    private List<MedicationScheduleDTO> schedules;
    private OffsetDateTime createdAt;
}
