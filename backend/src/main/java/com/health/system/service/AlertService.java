package com.health.system.service;

import com.health.system.dto.HealthAlertDto;
import com.health.system.entity.HealthAlert;
import com.health.system.entity.HealthRecord;
import com.health.system.entity.User;
import com.health.system.exception.ResourceNotFoundException;
import com.health.system.repository.HealthAlertRepository;
import com.health.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final HealthAlertRepository alertRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<HealthAlertDto> getUserAlerts(Long userId) {
        return alertRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return alertRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long alertId, Long userId) {
        HealthAlert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found"));
        if (alert.getUser().getId().equals(userId)) {
            alert.setIsRead(true);
            alertRepository.save(alert);
        }
    }

    @Transactional
    public void checkAndTriggerVitalAlerts(User user, HealthRecord record) {
        // Heart Rate threshold rules (< 50 or > 100)
        if (record.getHeartRate() != null) {
            if (record.getHeartRate() > 100) {
                saveAlert(user, record, "WARNING", "Heart Rate",
                        "Heart rate (" + record.getHeartRate() + " BPM) is above resting target (Tachycardia range).",
                        "Rest quietly for 5-10 minutes. Avoid caffeine/strenuous exertion. If accompanied by chest tightness or dizziness, seek medical care immediately.");
            } else if (record.getHeartRate() < 50) {
                saveAlert(user, record, "WARNING", "Heart Rate",
                        "Heart rate (" + record.getHeartRate() + " BPM) is below standard resting average.",
                        "If you are an endurance athlete this may be normal; otherwise monitor for lightheadedness or fatigue.");
            }
        }

        // Blood Pressure rules (Systolic > 140 or Diastolic > 90 -> Critical/Warning)
        if (record.getSystolicBp() != null && record.getDiastolicBp() != null) {
            if (record.getSystolicBp() >= 140 || record.getDiastolicBp() >= 90) {
                saveAlert(user, record, "CRITICAL", "Blood Pressure",
                        "Blood Pressure reading (" + record.getSystolicBp() + "/" + record.getDiastolicBp() + " mmHg) is in Stage 2 Hypertension range.",
                        "Sit upright, stay hydrated, and repeat the measurement in 15 minutes. Contact your primary care doctor if BP remains elevated.");
            } else if (record.getSystolicBp() >= 130 || record.getDiastolicBp() >= 80) {
                saveAlert(user, record, "WARNING", "Blood Pressure",
                        "Blood Pressure reading (" + record.getSystolicBp() + "/" + record.getDiastolicBp() + " mmHg) is slightly elevated.",
                        "Monitor dietary sodium intake and maintain regular exercise telemetry.");
            }
        }

        // SpO2 rules (< 95% -> Warning, < 90% -> Critical)
        if (record.getSpo2() != null) {
            if (record.getSpo2() < 90.0) {
                saveAlert(user, record, "CRITICAL", "SpO2 (Blood Oxygen)",
                        "SpO2 oxygen saturation level (" + record.getSpo2() + "%) is critically low.",
                        "Sit upright, take deep breaths, and seek urgent clinical attention if dyspnea or confusion occurs.");
            } else if (record.getSpo2() < 95.0) {
                saveAlert(user, record, "WARNING", "SpO2 (Blood Oxygen)",
                        "SpO2 oxygen saturation (" + record.getSpo2() + "%) is slightly below optimal 95-100% range.",
                        "Ensure room ventilation and re-check pulse oximeter placement.");
            }
        }

        // Blood Glucose rules (> 180 or < 70)
        if (record.getBloodGlucose() != null) {
            if (record.getBloodGlucose() > 180.0) {
                saveAlert(user, record, "WARNING", "Blood Glucose",
                        "Blood Glucose (" + record.getBloodGlucose() + " mg/dL) is above target range.",
                        "Review carbohydrate intake and medication schedule.");
            } else if (record.getBloodGlucose() < 70.0) {
                saveAlert(user, record, "CRITICAL", "Blood Glucose",
                        "Blood Glucose (" + record.getBloodGlucose() + " mg/dL) is below 70 mg/dL (Hypoglycemia risk).",
                        "Consume 15g of fast-acting carbohydrates (juice/glucose tablets) and re-test in 15 minutes.");
            }
        }
    }

    private void saveAlert(User user, HealthRecord record, String level, String vitalType, String msg, String guidance) {
        HealthAlert alert = HealthAlert.builder()
                .user(user)
                .record(record)
                .alertLevel(level)
                .vitalType(vitalType)
                .message(msg)
                .guidance(guidance)
                .isRead(false)
                .build();
        alertRepository.save(alert);
    }

    private HealthAlertDto mapToDto(HealthAlert alert) {
        return HealthAlertDto.builder()
                .id(alert.getId())
                .userId(alert.getUser().getId())
                .recordId(alert.getRecord() != null ? alert.getRecord().getId() : null)
                .alertLevel(alert.getAlertLevel())
                .vitalType(alert.getVitalType())
                .message(alert.getMessage())
                .guidance(alert.getGuidance())
                .isRead(alert.getIsRead())
                .createdAt(alert.getCreatedAt())
                .build();
    }
}
