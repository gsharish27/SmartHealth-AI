package com.health.system.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_records")
public class HealthRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "heart_rate")
    private Integer heartRate;

    @Column(name = "systolic_bp")
    private Integer systolicBp;

    @Column(name = "diastolic_bp")
    private Integer diastolicBp;

    private Double spo2;

    @Column(name = "blood_glucose")
    private Double bloodGlucose;

    private Double temperature;

    private Double weight;

    private Double height;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public HealthRecord() {}

    public HealthRecord(Long id, User user, Integer heartRate, Integer systolicBp, Integer diastolicBp, Double spo2, Double bloodGlucose, Double temperature, Double weight, Double height, String notes, LocalDateTime recordedAt, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.heartRate = heartRate;
        this.systolicBp = systolicBp;
        this.diastolicBp = diastolicBp;
        this.spo2 = spo2;
        this.bloodGlucose = bloodGlucose;
        this.temperature = temperature;
        this.weight = weight;
        this.height = height;
        this.notes = notes;
        this.recordedAt = recordedAt;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (recordedAt == null) {
            recordedAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Integer getHeartRate() { return heartRate; }
    public void setHeartRate(Integer heartRate) { this.heartRate = heartRate; }

    public Integer getSystolicBp() { return systolicBp; }
    public void setSystolicBp(Integer systolicBp) { this.systolicBp = systolicBp; }

    public Integer getDiastolicBp() { return diastolicBp; }
    public void setDiastolicBp(Integer diastolicBp) { this.diastolicBp = diastolicBp; }

    public Double getSpo2() { return spo2; }
    public void setSpo2(Double spo2) { this.spo2 = spo2; }

    public Double getBloodGlucose() { return bloodGlucose; }
    public void setBloodGlucose(Double bloodGlucose) { this.bloodGlucose = bloodGlucose; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static HealthRecordBuilder builder() {
        return new HealthRecordBuilder();
    }

    public static class HealthRecordBuilder {
        private Long id;
        private User user;
        private Integer heartRate;
        private Integer systolicBp;
        private Integer diastolicBp;
        private Double spo2;
        private Double bloodGlucose;
        private Double temperature;
        private Double weight;
        private Double height;
        private String notes;
        private LocalDateTime recordedAt;
        private LocalDateTime createdAt;

        public HealthRecordBuilder id(Long id) { this.id = id; return this; }
        public HealthRecordBuilder user(User user) { this.user = user; return this; }
        public HealthRecordBuilder heartRate(Integer heartRate) { this.heartRate = heartRate; return this; }
        public HealthRecordBuilder systolicBp(Integer systolicBp) { this.systolicBp = systolicBp; return this; }
        public HealthRecordBuilder diastolicBp(Integer diastolicBp) { this.diastolicBp = diastolicBp; return this; }
        public HealthRecordBuilder spo2(Double spo2) { this.spo2 = spo2; return this; }
        public HealthRecordBuilder bloodGlucose(Double bloodGlucose) { this.bloodGlucose = bloodGlucose; return this; }
        public HealthRecordBuilder temperature(Double temperature) { this.temperature = temperature; return this; }
        public HealthRecordBuilder weight(Double weight) { this.weight = weight; return this; }
        public HealthRecordBuilder height(Double height) { this.height = height; return this; }
        public HealthRecordBuilder notes(String notes) { this.notes = notes; return this; }
        public HealthRecordBuilder recordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; return this; }
        public HealthRecordBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public HealthRecord build() {
            return new HealthRecord(id, user, heartRate, systolicBp, diastolicBp, spo2, bloodGlucose, temperature, weight, height, notes, recordedAt, createdAt);
        }
    }
}
