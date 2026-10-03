package com.healthmonitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertDTO {

    private Long id;
    private Long userId;
    private Long healthRecordId;
    private String alertLevel; // NORMAL, WARNING, CRITICAL
    private String metricType; // BLOOD_PRESSURE, HEART_RATE, SPO2, GLUCOSE
    private String triggeredValue;
    private String message;
    private String guidance;
    private Boolean isRead;
    private OffsetDateTime createdAt;
}
