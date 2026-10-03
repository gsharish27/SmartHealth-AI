package com.healthmonitoring.service;

import com.healthmonitoring.dto.*;
import com.healthmonitoring.entity.HealthAlert;
import com.healthmonitoring.entity.HealthRecord;
import com.healthmonitoring.entity.User;
import com.healthmonitoring.exception.ResourceNotFoundException;
import com.healthmonitoring.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HealthRecordService {

    private final HealthRecordRepository healthRecordRepository;
    private final UserRepository userRepository;
    private final HealthAlertRepository healthAlertRepository;

    @Transactional
    public HealthRecordDTO createRecord(Long userId, HealthRecordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        OffsetDateTime recordedAt = request.getRecordedAt() != null ? request.getRecordedAt() : OffsetDateTime.now();

        HealthRecord record = HealthRecord.builder()
                .user(user)
                .heartRate(request.getHeartRate())
                .systolicBp(request.getSystolicBp())
                .diastolicBp(request.getDiastolicBp())
                .spo2(request.getSpo2())
                .bloodGlucose(request.getBloodGlucose())
                .bodyTemperature(request.getBodyTemperature())
                .weightKg(request.getWeightKg())
                .heightCm(request.getHeightCm())
                .sleepHours(request.getSleepHours())
                .steps(request.getSteps())
                .notes(request.getNotes())
                .recordedAt(recordedAt)
                .build();

        HealthRecord savedRecord = healthRecordRepository.save(record);

        // Evaluate automated alerts for abnormal readings
        evaluateAlerts(savedRecord);

        return mapToDTO(savedRecord);
    }

    @Transactional(readOnly = true)
    public PagedResponse<HealthRecordDTO> getRecords(Long userId, OffsetDateTime startDate, OffsetDateTime endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<HealthRecord> recordPage = healthRecordRepository.findByUserIdAndDateRange(userId, startDate, endDate, pageable);
        return PagedResponse.from(recordPage.map(this::mapToDTO));
    }

    @Transactional(readOnly = true)
    public HealthRecordDTO getRecordById(Long recordId, Long userId) {
        HealthRecord record = healthRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Health record not found: " + recordId));

        if (!record.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Health record not found for user: " + recordId);
        }

        return mapToDTO(record);
    }

    @Transactional
    public HealthRecordDTO updateRecord(Long recordId, Long userId, HealthRecordRequest request) {
        HealthRecord record = healthRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Health record not found: " + recordId));

        if (!record.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Health record not found for user: " + recordId);
        }

        if (request.getHeartRate() != null) record.setHeartRate(request.getHeartRate());
        if (request.getSystolicBp() != null) record.setSystolicBp(request.getSystolicBp());
        if (request.getDiastolicBp() != null) record.setDiastolicBp(request.getDiastolicBp());
        if (request.getSpo2() != null) record.setSpo2(request.getSpo2());
        if (request.getBloodGlucose() != null) record.setBloodGlucose(request.getBloodGlucose());
        if (request.getBodyTemperature() != null) record.setBodyTemperature(request.getBodyTemperature());
        if (request.getWeightKg() != null) record.setWeightKg(request.getWeightKg());
        if (request.getHeightCm() != null) record.setHeightCm(request.getHeightCm());
        if (request.getSleepHours() != null) record.setSleepHours(request.getSleepHours());
        if (request.getSteps() != null) record.setSteps(request.getSteps());
        if (request.getNotes() != null) record.setNotes(request.getNotes());

        HealthRecord updated = healthRecordRepository.save(record);
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteRecord(Long recordId, Long userId) {
        HealthRecord record = healthRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Health record not found: " + recordId));

        if (!record.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Health record not found for user: " + recordId);
        }

        healthRecordRepository.delete(record);
    }

    @Transactional(readOnly = true)
    public List<VitalTrendDTO> getTrends(Long userId, String timeRange, OffsetDateTime customStart, OffsetDateTime customEnd) {
        OffsetDateTime endDate = customEnd != null ? customEnd : OffsetDateTime.now();
        OffsetDateTime startDate;

        if (customStart != null) {
            startDate = customStart;
        } else {
            startDate = switch (timeRange != null ? timeRange : "7d") {
                case "30d" -> endDate.minusDays(30);
                case "3m" -> endDate.minusMonths(3);
                case "6m" -> endDate.minusMonths(6);
                case "1y" -> endDate.minusYears(1);
                default -> endDate.minusDays(7); // 7d default
            };
        }

        List<HealthRecord> records = healthRecordRepository.findTrendsByUserIdAndDateRange(userId, startDate, endDate);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");

        return records.stream().map(r -> VitalTrendDTO.builder()
                .dateLabel(r.getRecordedAt().format(formatter))
                .timestamp(r.getRecordedAt().toString())
                .heartRate(r.getHeartRate())
                .systolicBp(r.getSystolicBp())
                .diastolicBp(r.getDiastolicBp())
                .spo2(r.getSpo2())
                .bloodGlucose(r.getBloodGlucose())
                .bodyTemperature(r.getBodyTemperature())
                .weightKg(r.getWeightKg())
                .sleepHours(r.getSleepHours())
                .steps(r.getSteps())
                .build()).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VitalCardDTO> getVitalCards(Long userId) {
        List<HealthRecord> recent = healthRecordRepository.findTop2ByUserIdOrderByRecordedAtDesc(userId, PageRequest.of(0, 2));

        HealthRecord latest = recent.size() > 0 ? recent.get(0) : null;
        HealthRecord prev = recent.size() > 1 ? recent.get(1) : null;

        List<HealthRecord> sparklineRecords = healthRecordRepository.findTrendsByUserIdAndDateRange(
                userId, OffsetDateTime.now().minusDays(7), OffsetDateTime.now());

        List<VitalCardDTO> cards = new ArrayList<>();

        // 1. Heart Rate
        cards.add(buildVitalCard(
                "heart_rate", "Heart Rate", "Heart",
                latest != null && latest.getHeartRate() != null ? String.valueOf(latest.getHeartRate()) : "--",
                "BPM",
                latest != null && latest.getHeartRate() != null ? (latest.getHeartRate() > 100 || latest.getHeartRate() < 50 ? "Elevated" : "Normal") : "No Data",
                calculateChange(latest != null ? latest.getHeartRate() : null, prev != null ? prev.getHeartRate() : null),
                latest != null ? formatTimeAgo(latest.getRecordedAt()) : "Never",
                sparklineRecords.stream().filter(r -> r.getHeartRate() != null).map(r -> r.getHeartRate().doubleValue()).collect(Collectors.toList())
        ));

        // 2. Blood Pressure
        String bpVal = "--";
        String bpStatus = "No Data";
        if (latest != null && latest.getSystolicBp() != null && latest.getDiastolicBp() != null) {
            bpVal = latest.getSystolicBp() + "/" + latest.getDiastolicBp();
            bpStatus = (latest.getSystolicBp() > 130 || latest.getDiastolicBp() > 85) ? "Warning" : "Normal";
        }
        cards.add(buildVitalCard(
                "blood_pressure", "Blood Pressure", "Activity",
                bpVal,
                "mmHg",
                bpStatus,
                calculateChange(latest != null ? latest.getSystolicBp() : null, prev != null ? prev.getSystolicBp() : null),
                latest != null ? formatTimeAgo(latest.getRecordedAt()) : "Never",
                sparklineRecords.stream().filter(r -> r.getSystolicBp() != null).map(r -> r.getSystolicBp().doubleValue()).collect(Collectors.toList())
        ));

        // 3. SpO2
        cards.add(buildVitalCard(
                "spo2", "SpO2", "Wind",
                latest != null && latest.getSpo2() != null ? String.valueOf(latest.getSpo2()) : "--",
                "%",
                latest != null && latest.getSpo2() != null ? (latest.getSpo2() < 95 ? "Warning" : "Optimal") : "No Data",
                calculateChange(latest != null ? latest.getSpo2() : null, prev != null ? prev.getSpo2() : null),
                latest != null ? formatTimeAgo(latest.getRecordedAt()) : "Never",
                sparklineRecords.stream().filter(r -> r.getSpo2() != null).map(r -> r.getSpo2().doubleValue()).collect(Collectors.toList())
        ));

        // 4. Blood Glucose
        cards.add(buildVitalCard(
                "glucose", "Blood Glucose", "Droplet",
                latest != null && latest.getBloodGlucose() != null ? latest.getBloodGlucose().toString() : "--",
                "mg/dL",
                latest != null && latest.getBloodGlucose() != null ? (latest.getBloodGlucose().doubleValue() > 140 ? "Elevated" : "Normal") : "No Data",
                calculateChangeBigDecimal(latest != null ? latest.getBloodGlucose() : null, prev != null ? prev.getBloodGlucose() : null),
                latest != null ? formatTimeAgo(latest.getRecordedAt()) : "Never",
                sparklineRecords.stream().filter(r -> r.getBloodGlucose() != null).map(r -> r.getBloodGlucose().doubleValue()).collect(Collectors.toList())
        ));

        // 5. Weight
        cards.add(buildVitalCard(
                "weight", "Weight", "Scale",
                latest != null && latest.getWeightKg() != null ? latest.getWeightKg().toString() : "--",
                "kg",
                "Optimal",
                calculateChangeBigDecimal(latest != null ? latest.getWeightKg() : null, prev != null ? prev.getWeightKg() : null),
                latest != null ? formatTimeAgo(latest.getRecordedAt()) : "Never",
                sparklineRecords.stream().filter(r -> r.getWeightKg() != null).map(r -> r.getWeightKg().doubleValue()).collect(Collectors.toList())
        ));

        // 6. Temperature
        cards.add(buildVitalCard(
                "temperature", "Temperature", "Thermometer",
                latest != null && latest.getBodyTemperature() != null ? latest.getBodyTemperature().toString() : "--",
                "°C",
                latest != null && latest.getBodyTemperature() != null ? (latest.getBodyTemperature().doubleValue() > 37.5 ? "Fever" : "Normal") : "No Data",
                calculateChangeBigDecimal(latest != null ? latest.getBodyTemperature() : null, prev != null ? prev.getBodyTemperature() : null),
                latest != null ? formatTimeAgo(latest.getRecordedAt()) : "Never",
                sparklineRecords.stream().filter(r -> r.getBodyTemperature() != null).map(r -> r.getBodyTemperature().doubleValue()).collect(Collectors.toList())
        ));

        // 7. Sleep
        cards.add(buildVitalCard(
                "sleep", "Sleep", "Moon",
                latest != null && latest.getSleepHours() != null ? latest.getSleepHours().toString() : "--",
                "hrs",
                latest != null && latest.getSleepHours() != null ? (latest.getSleepHours().doubleValue() < 7 ? "Below Goal" : "Optimal") : "No Data",
                calculateChangeBigDecimal(latest != null ? latest.getSleepHours() : null, prev != null ? prev.getSleepHours() : null),
                latest != null ? formatTimeAgo(latest.getRecordedAt()) : "Never",
                sparklineRecords.stream().filter(r -> r.getSleepHours() != null).map(r -> r.getSleepHours().doubleValue()).collect(Collectors.toList())
        ));

        // 8. Steps
        cards.add(buildVitalCard(
                "steps", "Steps", "Footprints",
                latest != null && latest.getSteps() != null ? String.format("%,d", latest.getSteps()) : "--",
                "steps",
                latest != null && latest.getSteps() != null ? (latest.getSteps() >= 10000 ? "Goal Met" : "In Progress") : "No Data",
                calculateChange(latest != null ? latest.getSteps() : null, prev != null ? prev.getSteps() : null),
                latest != null ? formatTimeAgo(latest.getRecordedAt()) : "Never",
                sparklineRecords.stream().filter(r -> r.getSteps() != null).map(r -> r.getSteps().doubleValue()).collect(Collectors.toList())
        ));

        return cards;
    }

    private VitalCardDTO buildVitalCard(String key, String title, String icon, String currVal, String unit, String status, String changeText, String timeAgo, List<Double> sparkline) {
        String direction = "FLAT";
        if (changeText.contains("↑")) direction = "UP";
        else if (changeText.contains("↓")) direction = "DOWN";

        return VitalCardDTO.builder()
                .key(key)
                .title(title)
                .icon(icon)
                .currentValue(currVal)
                .unit(unit)
                .status(status)
                .changePercentage(changeText)
                .changeDirection(direction)
                .lastUpdatedText(timeAgo)
                .sparklineData(sparkline)
                .build();
    }

    private String calculateChange(Integer current, Integer previous) {
        if (current == null || previous == null || previous == 0) {
            return "0% from previous";
        }
        double diff = ((double) (current - previous) / previous) * 100;
        if (diff > 0) return String.format("↑ %.1f%% from previous", diff);
        if (diff < 0) return String.format("↓ %.1f%% from previous", Math.abs(diff));
        return "0% from previous";
    }

    private String calculateChangeBigDecimal(BigDecimal current, BigDecimal previous) {
        if (current == null || previous == null || previous.doubleValue() == 0) {
            return "0% from previous";
        }
        double diff = ((current.doubleValue() - previous.doubleValue()) / previous.doubleValue()) * 100;
        if (diff > 0) return String.format("↑ %.1f%% from previous", diff);
        if (diff < 0) return String.format("↓ %.1f%% from previous", Math.abs(diff));
        return "0% from previous";
    }

    private String formatTimeAgo(OffsetDateTime time) {
        if (time == null) return "Never";
        long seconds = java.time.Duration.between(time, OffsetDateTime.now()).getSeconds();
        if (seconds < 60) return "Just now";
        long minutes = seconds / 60;
        if (minutes < 60) return minutes + " mins ago";
        long hours = minutes / 60;
        if (hours < 24) return hours + " hrs ago";
        long days = hours / 24;
        return days + " days ago";
    }

    private void evaluateAlerts(HealthRecord record) {
        // Non-diagnostic alert generation
        if (record.getSystolicBp() != null && record.getSystolicBp() > 135) {
            healthAlertRepository.save(HealthAlert.builder()
                    .user(record.getUser())
                    .healthRecord(record)
                    .alertLevel(record.getSystolicBp() > 150 ? "CRITICAL" : "WARNING")
                    .metricType("BLOOD_PRESSURE")
                    .triggeredValue(record.getSystolicBp() + "/" + (record.getDiastolicBp() != null ? record.getDiastolicBp() : "--") + " mmHg")
                    .message("Your latest blood pressure reading is outside your configured monitoring range.")
                    .guidance("Please sit comfortably in a relaxed environment for 10 minutes and repeat the measurement. If high readings persist, contact your healthcare provider.")
                    .isRead(false)
                    .build());
        }

        if (record.getSpo2() != null && record.getSpo2() < 94) {
            healthAlertRepository.save(HealthAlert.builder()
                    .user(record.getUser())
                    .healthRecord(record)
                    .alertLevel(record.getSpo2() < 90 ? "CRITICAL" : "WARNING")
                    .metricType("SPO2")
                    .triggeredValue(record.getSpo2() + "%")
                    .message("Your oxygen saturation (SpO2) reading is lower than target baseline.")
                    .guidance("Ensure pulse oximeter probe is warm and properly attached to clean finger. Take deep breaths. Seek immediate medical attention if experiencing shortness of breath.")
                    .isRead(false)
                    .build());
        }
    }

    public HealthRecordDTO mapToDTO(HealthRecord record) {
        String bpFormatted = null;
        if (record.getSystolicBp() != null && record.getDiastolicBp() != null) {
            bpFormatted = record.getSystolicBp() + "/" + record.getDiastolicBp();
        }

        return HealthRecordDTO.builder()
                .id(record.getId())
                .userId(record.getUser().getId())
                .heartRate(record.getHeartRate())
                .systolicBp(record.getSystolicBp())
                .diastolicBp(record.getDiastolicBp())
                .bloodPressureFormatted(bpFormatted)
                .spo2(record.getSpo2())
                .bloodGlucose(record.getBloodGlucose())
                .bodyTemperature(record.getBodyTemperature())
                .weightKg(record.getWeightKg())
                .heightCm(record.getHeightCm())
                .sleepHours(record.getSleepHours())
                .steps(record.getSteps())
                .notes(record.getNotes())
                .recordedAt(record.getRecordedAt())
                .createdAt(record.getCreatedAt())
                .build();
    }
}
