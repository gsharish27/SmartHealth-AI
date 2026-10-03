package com.healthmonitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthRecordDTO {

    private Long id;
    private Long userId;
    private Integer heartRate;
    private Integer systolicBp;
    private Integer diastolicBp;
    private String bloodPressureFormatted; // e.g. "120/80"
    private Integer spo2;
    private BigDecimal bloodGlucose;
    private BigDecimal bodyTemperature;
    private BigDecimal weightKg;
    private BigDecimal heightCm;
    private BigDecimal sleepHours;
    private Integer steps;
    private String notes;
    private OffsetDateTime recordedAt;
    private OffsetDateTime createdAt;
}
