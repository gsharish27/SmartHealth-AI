package com.health.system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VitalSummaryDto {
    private String name;           // Heart Rate, Blood Pressure, SpO2, etc.
    private String icon;           // heart, activity, wind, etc.
    private String value;          // "72", "120/80", "98.5", etc.
    private String unit;           // BPM, mmHg, %, mg/dL, kg, °C, hrs, steps
    private String status;         // Normal, Warning, Critical
    private String statusColor;    // emerald, amber, rose, blue
    private String changePercentage; // "↓ 3% from yesterday"
    private Boolean isPositiveTrend;
    private String lastUpdated;
    private List<Double> sparklineData;
}
