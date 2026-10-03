package com.health.system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthAnalyticsDto {
    private String timeframe; // 7d, 30d, 3m, 6m, 1y, custom
    private List<AnalyticsDataPoint> series;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnalyticsDataPoint {
        private String timestamp;
        private Integer heartRate;
        private Integer systolicBp;
        private Integer diastolicBp;
        private Double spo2;
        private Double bloodGlucose;
        private Double weight;
        private Double sleepHours;
        private Integer steps;
    }
}
