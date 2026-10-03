package com.healthmonitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorPatientDTO {

    private Long patientId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String avatarUrl;
    private Integer age;
    private String gender;
    private String bloodGroup;
    private HealthRecordDTO latestVitals;
    private List<AlertDTO> activeAlerts;
    private OffsetDateTime accessGrantedAt;
}
