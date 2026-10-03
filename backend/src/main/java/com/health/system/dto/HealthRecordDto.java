package com.health.system.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class HealthRecordDto {
    private Long id;
    private Long userId;

    private Integer heartRate;
    private Integer systolicBp;
    private Integer diastolicBp;
    private Double spo2;
    private Double bloodGlucose;
    private Double temperature;
    private Double weight;
    private Double height;

    private String notes;

    @NotNull(message = "Recorded date/time is required")
    private LocalDateTime recordedAt;
    private LocalDateTime createdAt;

    public HealthRecordDto() {}

    public HealthRecordDto(Long id, Long userId, Integer heartRate, Integer systolicBp, Integer diastolicBp, Double spo2, Double bloodGlucose, Double temperature, Double weight, Double height, String notes, LocalDateTime recordedAt, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

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

    public static HealthRecordDtoBuilder builder() {
        return new HealthRecordDtoBuilder();
    }

    public static class HealthRecordDtoBuilder {
        private Long id;
        private Long userId;
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

        public HealthRecordDtoBuilder id(Long id) { this.id = id; return this; }
        public HealthRecordDtoBuilder userId(Long userId) { this.userId = userId; return this; }
        public HealthRecordDtoBuilder heartRate(Integer heartRate) { this.heartRate = heartRate; return this; }
        public HealthRecordDtoBuilder systolicBp(Integer systolicBp) { this.systolicBp = systolicBp; return this; }
        public HealthRecordDtoBuilder diastolicBp(Integer diastolicBp) { this.diastolicBp = diastolicBp; return this; }
        public HealthRecordDtoBuilder spo2(Double spo2) { this.spo2 = spo2; return this; }
        public HealthRecordDtoBuilder bloodGlucose(Double bloodGlucose) { this.bloodGlucose = bloodGlucose; return this; }
        public HealthRecordDtoBuilder temperature(Double temperature) { this.temperature = temperature; return this; }
        public HealthRecordDtoBuilder weight(Double weight) { this.weight = weight; return this; }
        public HealthRecordDtoBuilder height(Double height) { this.height = height; return this; }
        public HealthRecordDtoBuilder notes(String notes) { this.notes = notes; return this; }
        public HealthRecordDtoBuilder recordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; return this; }
        public HealthRecordDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public HealthRecordDto build() {
            return new HealthRecordDto(id, userId, heartRate, systolicBp, diastolicBp, spo2, bloodGlucose, temperature, weight, height, notes, recordedAt, createdAt);
        }
    }
}
