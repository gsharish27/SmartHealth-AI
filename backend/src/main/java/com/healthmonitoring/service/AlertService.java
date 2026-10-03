package com.healthmonitoring.service;

import com.healthmonitoring.dto.AlertDTO;
import com.healthmonitoring.dto.PagedResponse;

import com.healthmonitoring.entity.HealthAlert;
import com.healthmonitoring.exception.ResourceNotFoundException;
import com.healthmonitoring.repository.HealthAlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final HealthAlertRepository alertRepository;

    @Transactional(readOnly = true)
    public PagedResponse<AlertDTO> getUserAlerts(Long userId, String level, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<HealthAlert> alertPage = alertRepository.findFiltered(userId, level, pageable);
        return PagedResponse.from(alertPage.map(this::mapToDTO));
    }

    @Transactional(readOnly = true)
    public List<AlertDTO> getRecentUserAlerts(Long userId) {
        return alertRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAlertAsRead(Long alertId, Long userId) {
        HealthAlert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found: " + alertId));

        if (!alert.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Alert not found for user: " + alertId);
        }

        alert.setIsRead(true);
        alertRepository.save(alert);
    }

    public AlertDTO mapToDTO(HealthAlert alert) {
        return AlertDTO.builder()
                .id(alert.getId())
                .userId(alert.getUser().getId())
                .healthRecordId(alert.getHealthRecord() != null ? alert.getHealthRecord().getId() : null)
                .alertLevel(alert.getAlertLevel())
                .metricType(alert.getMetricType())
                .triggeredValue(alert.getTriggeredValue())
                .message(alert.getMessage())
                .guidance(alert.getGuidance())
                .isRead(alert.getIsRead())
                .createdAt(alert.getCreatedAt())
                .build();
    }
}
