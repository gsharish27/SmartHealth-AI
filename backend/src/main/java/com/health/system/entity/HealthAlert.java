package com.health.system.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_alerts")
public class HealthAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "record_id")
    private HealthRecord record;

    @Column(name = "alert_level", nullable = false, length = 20)
    private String alertLevel; // NORMAL, WARNING, CRITICAL

    @Column(name = "vital_type", nullable = false, length = 50)
    private String vitalType;

    @Column(nullable = false)
    private String message;

    @Column(columnDefinition = "TEXT")
    private String guidance;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public HealthAlert() {}

    public HealthAlert(Long id, User user, HealthRecord record, String alertLevel, String vitalType, String message, String guidance, Boolean isRead, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.record = record;
        this.alertLevel = alertLevel;
        this.vitalType = vitalType;
        this.message = message;
        this.guidance = guidance;
        this.isRead = isRead != null ? isRead : false;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public HealthRecord getRecord() { return record; }
    public void setRecord(HealthRecord record) { this.record = record; }

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

    public static HealthAlertBuilder builder() {
        return new HealthAlertBuilder();
    }

    public static class HealthAlertBuilder {
        private Long id;
        private User user;
        private HealthRecord record;
        private String alertLevel;
        private String vitalType;
        private String message;
        private String guidance;
        private Boolean isRead = false;
        private LocalDateTime createdAt;

        public HealthAlertBuilder id(Long id) { this.id = id; return this; }
        public HealthAlertBuilder user(User user) { this.user = user; return this; }
        public HealthAlertBuilder record(HealthRecord record) { this.record = record; return this; }
        public HealthAlertBuilder alertLevel(String alertLevel) { this.alertLevel = alertLevel; return this; }
        public HealthAlertBuilder vitalType(String vitalType) { this.vitalType = vitalType; return this; }
        public HealthAlertBuilder message(String message) { this.message = message; return this; }
        public HealthAlertBuilder guidance(String guidance) { this.guidance = guidance; return this; }
        public HealthAlertBuilder isRead(Boolean isRead) { this.isRead = isRead; return this; }
        public HealthAlertBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public HealthAlert build() {
            return new HealthAlert(id, user, record, alertLevel, vitalType, message, guidance, isRead, createdAt);
        }
    }
}
