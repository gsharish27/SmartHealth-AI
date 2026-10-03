package com.health.system.dto;

import java.time.LocalDateTime;

public class HealthAlertDto {
    private Long id;
    private Long userId;
    private Long recordId;
    private String alertLevel; // NORMAL, WARNING, CRITICAL
    private String vitalType;
    private String message;
    private String guidance;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public HealthAlertDto() {}

    public HealthAlertDto(Long id, Long userId, Long recordId, String alertLevel, String vitalType, String message, String guidance, Boolean isRead, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.recordId = recordId;
        this.alertLevel = alertLevel;
        this.vitalType = vitalType;
        this.message = message;
        this.guidance = guidance;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getRecordId() { return recordId; }
    public void setRecordId(Long recordId) { this.recordId = recordId; }

    public String getAlertLevel() { return alertLevel; }
    public void setAlertLevel(String alertLevel) { this.alertLevel = alertLevel; }

    public String getVitalType() { return vitalType; }
    public void setVitalType(String vitalType) { this.vitalType = vitalType; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getGuidance() { return guidance; }
    public void setGuidance(String guidance) { this.guidance = guidance; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static HealthAlertDtoBuilder builder() {
        return new HealthAlertDtoBuilder();
    }

    public static class HealthAlertDtoBuilder {
        private Long id;
        private Long userId;
        private Long recordId;
        private String alertLevel;
        private String vitalType;
        private String message;
        private String guidance;
        private Boolean isRead;
        private LocalDateTime createdAt;

        public HealthAlertDtoBuilder id(Long id) { this.id = id; return this; }
        public HealthAlertDtoBuilder userId(Long userId) { this.userId = userId; return this; }
        public HealthAlertDtoBuilder recordId(Long recordId) { this.recordId = recordId; return this; }
        public HealthAlertDtoBuilder alertLevel(String alertLevel) { this.alertLevel = alertLevel; return this; }
        public HealthAlertDtoBuilder vitalType(String vitalType) { this.vitalType = vitalType; return this; }
        public HealthAlertDtoBuilder message(String message) { this.message = message; return this; }
        public HealthAlertDtoBuilder guidance(String guidance) { this.guidance = guidance; return this; }
        public HealthAlertDtoBuilder isRead(Boolean isRead) { this.isRead = isRead; return this; }
        public HealthAlertDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public HealthAlertDto build() {
            return new HealthAlertDto(id, userId, recordId, alertLevel, vitalType, message, guidance, isRead, createdAt);
        }
    }
}
