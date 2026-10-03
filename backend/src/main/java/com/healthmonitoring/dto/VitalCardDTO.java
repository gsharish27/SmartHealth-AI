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
public class VitalCardDTO {

    private String key;              // e.g. "heart_rate", "blood_pressure", "spo2", "glucose", "weight", "temperature", "sleep", "steps"
    private String title;            // e.g. "Heart Rate"
    private String icon;             // e.g. "Heart", "Activity", "Wind", "Droplet", "Scale", "Thermometer", "Moon", "Footprints"
    private String currentValue;     // e.g. "72", "120/80", "98"
    private String unit;             // e.g. "BPM", "mmHg", "%", "mg/dL", "kg", "°C", "hrs", "steps"
    private String status;           // e.g. "Normal", "Elevated", "Warning", "Critical"
    private String changePercentage; // e.g. "↓ 3% from yesterday", "↑ 2% from last week"
    private String changeDirection;  // "UP", "DOWN", "FLAT"
    private String lastUpdatedText;  // e.g. "2 hours ago"
    private List<Double> sparklineData; // recent values for sparkline rendering
}
