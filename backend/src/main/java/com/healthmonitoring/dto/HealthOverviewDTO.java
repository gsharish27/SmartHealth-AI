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
public class HealthOverviewDTO {

    private String userName;
    private String greeting; // "Good morning, John"
    private String subhead;  // "Here's your health overview for today."
    private List<VitalCardDTO> vitalCards;
    private List<AlertDTO> recentAlerts;
    private List<AppointmentDTO> upcomingAppointments;
    private List<MedicationDTO> todaysMedications;
}
