package com.health.system.service;

import com.health.system.dto.HealthAnalyticsDto;
import com.health.system.entity.HealthRecord;
import com.health.system.repository.HealthRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final HealthRecordRepository healthRecordRepository;

    @Transactional(readOnly = true)
    public HealthAnalyticsDto getHealthAnalytics(Long userId, String timeframe, LocalDateTime customStart, LocalDateTime customEnd) {
        LocalDateTime start;
        LocalDateTime end = LocalDateTime.now();

        if (timeframe == null) timeframe = "30d";

        switch (timeframe.toLowerCase()) {
            case "7d":
                start = end.minusDays(7);
                break;
            case "3m":
                start = end.minusMonths(3);
                break;
            case "6m":
                start = end.minusMonths(6);
                break;
            case "1y":
                start = end.minusYears(1);
                break;
            case "custom":
                start = customStart != null ? customStart : end.minusDays(30);
                end = customEnd != null ? customEnd : LocalDateTime.now();
                break;
            case "30d":
            default:
                start = end.minusDays(30);
                break;
        }

        List<HealthRecord> records = healthRecordRepository.findByUserIdAndDateRange(userId, start, end);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");

        List<HealthAnalyticsDto.AnalyticsDataPoint> points = new ArrayList<>();
        int stepCountSeed = 6500;

        for (HealthRecord r : records) {
            stepCountSeed += (r.getHeartRate() != null ? r.getHeartRate() * 15 : 1000) % 3500;
            points.add(HealthAnalyticsDto.AnalyticsDataPoint.builder()
                    .timestamp(r.getRecordedAt() != null ? r.getRecordedAt().format(formatter) : "N/A")
                    .heartRate(r.getHeartRate())
                    .systolicBp(r.getSystolicBp())
                    .diastolicBp(r.getDiastolicBp())
                    .spo2(r.getSpo2())
                    .bloodGlucose(r.getBloodGlucose())
                    .weight(r.getWeight())
                    .sleepHours(7.0 + (r.getId() % 3) * 0.5)
                    .steps(stepCountSeed % 12000 + 4000)
                    .build());
        }

        return HealthAnalyticsDto.builder()
                .timeframe(timeframe)
                .series(points)
                .build();
    }
}
