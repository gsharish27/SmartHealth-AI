package com.health.system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String specialty;
    private String licenseNumber;
    private String hospitalClinic;
    private String bio;
}
