package com.health.system.service;

import com.health.system.dto.*;
import com.health.system.entity.HealthRecord;
import com.health.system.entity.User;
import com.health.system.exception.ResourceNotFoundException;
import com.health.system.repository.HealthRecordRepository;
import com.health.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HealthRecordService {

    private final HealthRecordRepository healthRecordRepository;
    private final UserRepository userRepository;
    private final AlertService alertService;

    @Transactional(readOnly = true)
    public PagedResponse<HealthRecordDto> getHealthRecords(
            Long userId,
            String search,
            LocalDateTime startDate,
            LocalDateTime endDate,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<HealthRecord> recordsPage = healthRecordRepository.searchRecords(userId, search, startDate, endDate, pageable);

        List<HealthRecordDto> content = recordsPage.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return PagedResponse.<HealthRecordDto>builder()
                .content(content)
                .page(recordsPage.getNumber())
                .size(recordsPage.getSize())
                .totalElements(recordsPage.getTotalElements())
                .totalPages(recordsPage.getTotalPages())
                .last(recordsPage.isLast())
                .build();
    }

    @Transactional
    public HealthRecordDto createHealthRecord(Long userId, HealthRecordDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        HealthRecord record = HealthRecord.builder()
                .user(user)
                .heartRate(dto.getHeartRate())
                .systolicBp(dto.getSystolicBp())
                .diastolicBp(dto.getDiastolicBp())
                .spo2(dto.getSpo2())
                .bloodGlucose(dto.getBloodGlucose())
                .temperature(dto.getTemperature())
                .weight(dto.getWeight())
                .height(dto.getHeight())
                .notes(dto.getNotes())
                .recordedAt(dto.getRecordedAt() != null ? dto.getRecordedAt() : LocalDateTime.now())
                .build();

        HealthRecord saved = healthRecordRepository.save(record);

        // Evaluate automated alerts
        alertService.checkAndTriggerVitalAlerts(user, saved);

        return mapToDto(saved);
    }

    @Transactional
    public HealthRecordDto updateHealthRecord(Long id, Long userId, HealthRecordDto dto) {
        HealthRecord record = healthRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Health record not found"));

        if (!record.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Record not found for user");
        }

        record.setHeartRate(dto.getHeartRate());
        record.setSystolicBp(dto.getSystolicBp());
        record.setDiastolicBp(dto.getDiastolicBp());
        record.setSpo2(dto.getSpo2());
        record.setBloodGlucose(dto.getBloodGlucose());
        record.setTemperature(dto.getTemperature());
        record.setWeight(dto.getWeight());
        record.setHeight(dto.getHeight());
        record.setNotes(dto.getNotes());
        if (dto.getRecordedAt() != null) {
            record.setRecordedAt(dto.getRecordedAt());
        }

        HealthRecord updated = healthRecordRepository.save(record);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteHealthRecord(Long id, Long userId) {
        HealthRecord record = healthRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Health record not found"));
        if (!record.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Record not found for user");
        }
        healthRecordRepository.delete(record);
    }

    @Transactional(readOnly = true)
    public List<VitalSummaryDto> getDashboardVitalSummaries(Long userId) {
        List<HealthRecord> records = healthRecordRepository.findByUserIdAndDateRange(
                userId, LocalDateTime.now().minusDays(30), LocalDateTime.now()
        );

        HealthRecord latest = records.isEmpty() ? null : records.get(records.size() - 1);
        HealthRecord previous = records.size() >= 2 ? records.get(records.size() - 2) : null;

        List<VitalSummaryDto> summaries = new ArrayList<>();

        // 1. Heart Rate
        summaries.add(buildSummary(
                "Heart Rate", "heart",
                latest != null && latest.getHeartRate() != null ? String.valueOf(latest.getHeartRate()) : "72",
                "BPM",
                latest != null && latest.getHeartRate() != null && latest.getHeartRate() > 100 ? "Elevated" : "Normal",
                latest != null && latest.getHeartRate() != null && latest.getHeartRate() > 100 ? "amber" : "emerald",
                calculateChange(latest != null ? latest.getHeartRate() : 72, previous != null ? previous.getHeartRate() : 74),
                records.stream().map(r -> r.getHeartRate() != null ? r.getHeartRate().doubleValue() : 72.0).collect(Collectors.toList()),
                latest != null ? formatTime(latest.getRecordedAt()) : "Just now"
        ));

        // 2. Blood Pressure
        summaries.add(buildSummary(
                "Blood Pressure", "activity",
                latest != null && latest.getSystolicBp() != null ? latest.getSystolicBp() + "/" + latest.getDiastolicBp() : "120/80",
                "mmHg",
                latest != null && latest.getSystolicBp() != null && latest.getSystolicBp() > 130 ? "Stage 1" : "Normal",
                latest != null && latest.getSystolicBp() != null && latest.getSystolicBp() > 130 ? "amber" : "emerald",
                "↓ 2% from yesterday",
                records.stream().map(r -> r.getSystolicBp() != null ? r.getSystolicBp().doubleValue() : 120.0).collect(Collectors.toList()),
                latest != null ? formatTime(latest.getRecordedAt()) : "Just now"
        ));

        // 3. SpO2
        summaries.add(buildSummary(
                "SpO2", "wind",
                latest != null && latest.getSpo2() != null ? String.format("%.1f", latest.getSpo2()) : "98.5",
                "%",
                latest != null && latest.getSpo2() != null && latest.getSpo2() < 95 ? "Warning" : "Optimal",
                latest != null && latest.getSpo2() != null && latest.getSpo2() < 95 ? "amber" : "emerald",
                "↑ 0.5% from yesterday",
                records.stream().map(r -> r.getSpo2() != null ? r.getSpo2() : 98.5).collect(Collectors.toList()),
                latest != null ? formatTime(latest.getRecordedAt()) : "Just now"
        ));

        // 4. Blood Glucose
        summaries.add(buildSummary(
                "Blood Glucose", "droplet",
                latest != null && latest.getBloodGlucose() != null ? String.format("%.0f", latest.getBloodGlucose()) : "95",
                "mg/dL",
                latest != null && latest.getBloodGlucose() != null && latest.getBloodGlucose() > 140 ? "High" : "Normal",
                latest != null && latest.getBloodGlucose() != null && latest.getBloodGlucose() > 140 ? "rose" : "emerald",
                "↓ 1% from yesterday",
                records.stream().map(r -> r.getBloodGlucose() != null ? r.getBloodGlucose() : 95.0).collect(Collectors.toList()),
                latest != null ? formatTime(latest.getRecordedAt()) : "Just now"
        ));

        // 5. Weight
        summaries.add(buildSummary(
                "Weight", "scale",
                latest != null && latest.getWeight() != null ? String.format("%.1f", latest.getWeight()) : "75.3",
                "kg",
                "Stable",
                "blue",
                "↓ 0.2 kg past week",
                records.stream().map(r -> r.getWeight() != null ? r.getWeight() : 75.5).collect(Collectors.toList()),
                latest != null ? formatTime(latest.getRecordedAt()) : "Just now"
        ));

        // 6. Temperature
        summaries.add(buildSummary(
                "Temperature", "thermometer",
                latest != null && latest.getTemperature() != null ? String.format("%.1f", latest.getTemperature()) : "36.6",
                "°C",
                latest != null && latest.getTemperature() != null && latest.getTemperature() > 37.5 ? "Fever" : "Normal",
                latest != null && latest.getTemperature() != null && latest.getTemperature() > 37.5 ? "rose" : "emerald",
                "Optimal 36.6°C",
                records.stream().map(r -> r.getTemperature() != null ? r.getTemperature() : 36.6).collect(Collectors.toList()),
                latest != null ? formatTime(latest.getRecordedAt()) : "Just now"
        ));

        // 7. Sleep
        summaries.add(buildSummary(
                "Sleep Quality", "moon",
                "7.5",
                "hrs",
                "Restful",
                "emerald",
                "↑ 45m from avg",
                Arrays.asList(6.5, 7.0, 7.2, 6.8, 8.0, 7.1, 7.5),
                "7h 30m total"
        ));

        // 8. Steps
        summaries.add(buildSummary(
                "Daily Steps", "footprints",
                "8,420",
                "steps",
                "84% Goal",
                "blue",
                "↑ 1,200 past hour",
                Arrays.asList(5400.0, 6200.0, 8900.0, 7100.0, 10200.0, 8420.0),
                "Updated 5m ago"
        ));

        return summaries;
    }

    private VitalSummaryDto buildSummary(
            String name, String icon, String value, String unit, String status, String statusColor,
            String changePercentage, List<Double> sparkline, String lastUpdated
    ) {
        if (sparkline == null || sparkline.isEmpty()) {
            sparkline = Arrays.asList(70.0, 72.0, 71.0, 75.0, 73.0, 72.0);
        }
        return VitalSummaryDto.builder()
                .name(name)
                .icon(icon)
                .value(value)
                .unit(unit)
                .status(status)
                .statusColor(statusColor)
                .changePercentage(changePercentage)
                .isPositiveTrend(!changePercentage.contains("High") && !changePercentage.contains("CRITICAL"))
                .sparklineData(sparkline)
                .lastUpdated(lastUpdated)
                .build();
    }

    private String calculateChange(Number current, Number previous) {
        if (current == null || previous == null || previous.doubleValue() == 0) {
            return "Stable baseline";
        }
        double diff = current.doubleValue() - previous.doubleValue();
        double pct = (diff / previous.doubleValue()) * 100;
        if (pct >= 0) {
            return String.format("↑ %.1f%% from previous", pct);
        } else {
            return String.format("↓ %.1f%% from previous", Math.abs(pct));
        }
    }

    private String formatTime(LocalDateTime dt) {
        if (dt == null) return "Just now";
        return dt.format(DateTimeFormatter.ofPattern("MMM dd, HH:mm"));
    }

    private HealthRecordDto mapToDto(HealthRecord record) {
        return HealthRecordDto.builder()
                .id(record.getId())
                .userId(record.getUser().getId())
                .heartRate(record.getHeartRate())
                .systolicBp(record.getSystolicBp())
                .diastolicBp(record.getDiastolicBp())
                .spo2(record.getSpo2())
                .bloodGlucose(record.getBloodGlucose())
                .temperature(record.getTemperature())
                .weight(record.getWeight())
                .height(record.getHeight())
                .notes(record.getNotes())
                .recordedAt(record.getRecordedAt())
                .createdAt(record.getCreatedAt())
                .build();
    }
}
