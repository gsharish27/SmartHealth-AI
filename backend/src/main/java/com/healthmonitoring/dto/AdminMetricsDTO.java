package com.healthmonitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminMetricsDTO {

    private long totalUsers;
    private long activeUsers;
    private long totalDoctors;
    private long totalHealthRecords;
    private long totalAppointments;
    private long totalAlerts;
    private long criticalAlerts;
    private double systemUptimePercentage;
}
