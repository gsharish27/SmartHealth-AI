package com.healthmonitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthProfileDTO {

    private Long id;
    private LocalDate dateOfBirth;
    private Integer age;
    private String gender;
    private String bloodGroup;
    private BigDecimal heightCm;
    private BigDecimal weightKg;
    private String emergencyContactName;
    private String emergencyContactRelationship;
    private String emergencyContactPhone;
    private String allergies;
    private String medicalHistory;
    private Integer targetHeartRateMin;
    private Integer targetHeartRateMax;
    private Integer targetSystolicMax;
    private Integer targetDiastolicMax;
    private Integer targetSpo2Min;
    private BigDecimal targetGlucoseMax;
}
