package com.healthmonitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientOverviewDTO {

    private UserDTO user;
    private HealthProfileDTO profile;
    private HealthRecordDTO latestVitals;
    private List<VitalTrendDTO> trendHistory;
    private List<MedicationDTO> activeMedications;
    private List<AppointmentDTO> appointments;
    private List<AlertDTO> recentAlerts;
}
