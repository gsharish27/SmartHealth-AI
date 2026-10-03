package com.health.system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientOverviewDto {
    private Long patientId;
    private String fullName;
    private String email;
    private String phone;
    private Integer age;
    private String gender;
    private String bloodGroup;
    private HealthRecordDto latestVitals;
    private List<VitalSummaryDto> vitalSummaries;
    private List<HealthAlertDto> activeAlerts;
    private List<MedicationDto> activeMedications;
}
