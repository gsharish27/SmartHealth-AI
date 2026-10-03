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
public class DoctorDTO {

    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String avatarUrl;
    private String specialty;
    private String licenseNumber;
    private String hospitalAffinity;
    private String bio;
    private BigDecimal rating;
    private Integer experienceYears;
}
