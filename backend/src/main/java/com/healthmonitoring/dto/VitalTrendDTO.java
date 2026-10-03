package com.healthmonitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VitalTrendDTO {

    private String dateLabel; // formatted date string e.g. "Oct 01" or "10:30 AM"
    private String timestamp;
    private Integer heartRate;
    private Integer systolicBp;
    private Integer diastolicBp;
    private Integer spo2;
    private BigDecimal bloodGlucose;
    private BigDecimal bodyTemperature;
    private BigDecimal weightKg;
    private BigDecimal sleepHours;
    private Integer steps;
}
