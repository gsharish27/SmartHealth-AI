package com.healthmonitoring.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
public class HealthRecordRequest {

    @Min(value = 30, message = "Heart rate must be at least 30 BPM")
    @Max(value = 250, message = "Heart rate must be at most 250 BPM")
    private Integer heartRate;

    @Min(value = 60, message = "Systolic BP must be at least 60 mmHg")
    @Max(value = 260, message = "Systolic BP must be at most 260 mmHg")
    private Integer systolicBp;

    @Min(value = 40, message = "Diastolic BP must be at least 40 mmHg")
    @Max(value = 160, message = "Diastolic BP must be at most 160 mmHg")
    private Integer diastolicBp;

    @Min(value = 50, message = "SpO2 must be at least 50%")
    @Max(value = 100, message = "SpO2 must be at most 100%")
    private Integer spo2;

    private BigDecimal bloodGlucose;
    private BigDecimal bodyTemperature;
    private BigDecimal weightKg;
    private BigDecimal heightCm;
    private BigDecimal sleepHours;
    private Integer steps;
    private String notes;
    private OffsetDateTime recordedAt;
}
