package com.health.system.dto;

public class AdminMetricsDto {
    private long totalUsers;
    private long activeUsers;
    private long totalDoctors;
    private long totalHealthRecords;
    private long totalAppointments;
    private long totalAlerts;
    private long criticalAlerts;

    public AdminMetricsDto() {}

    public AdminMetricsDto(long totalUsers, long activeUsers, long totalDoctors, long totalHealthRecords, long totalAppointments, long totalAlerts, long criticalAlerts) {
        this.totalUsers = totalUsers;
        this.activeUsers = activeUsers;
        this.totalDoctors = totalDoctors;
        this.totalHealthRecords = totalHealthRecords;
        this.totalAppointments = totalAppointments;
        this.totalAlerts = totalAlerts;
        this.criticalAlerts = criticalAlerts;
    }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getActiveUsers() { return activeUsers; }
    public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }

    public long getTotalDoctors() { return totalDoctors; }
    public void setTotalDoctors(long totalDoctors) { this.totalDoctors = totalDoctors; }

    public long getTotalHealthRecords() { return totalHealthRecords; }
    public void setTotalHealthRecords(long totalHealthRecords) { this.totalHealthRecords = totalHealthRecords; }

    public long getTotalAppointments() { return totalAppointments; }
    public void setTotalAppointments(long totalAppointments) { this.totalAppointments = totalAppointments; }

    public long getTotalAlerts() { return totalAlerts; }
    public void setTotalAlerts(long totalAlerts) { this.totalAlerts = totalAlerts; }

    public long getCriticalAlerts() { return criticalAlerts; }
    public void setCriticalAlerts(long criticalAlerts) { this.criticalAlerts = criticalAlerts; }

    public static AdminMetricsDtoBuilder builder() {
        return new AdminMetricsDtoBuilder();
    }

    public static class AdminMetricsDtoBuilder {
        private long totalUsers;
        private long activeUsers;
        private long totalDoctors;
        private long totalHealthRecords;
        private long totalAppointments;
        private long totalAlerts;
        private long criticalAlerts;

        public AdminMetricsDtoBuilder totalUsers(long totalUsers) { this.totalUsers = totalUsers; return this; }
        public AdminMetricsDtoBuilder activeUsers(long activeUsers) { this.activeUsers = activeUsers; return this; }
        public AdminMetricsDtoBuilder totalDoctors(long totalDoctors) { this.totalDoctors = totalDoctors; return this; }
        public AdminMetricsDtoBuilder totalHealthRecords(long totalHealthRecords) { this.totalHealthRecords = totalHealthRecords; return this; }
        public AdminMetricsDtoBuilder totalAppointments(long totalAppointments) { this.totalAppointments = totalAppointments; return this; }
        public AdminMetricsDtoBuilder totalAlerts(long totalAlerts) { this.totalAlerts = totalAlerts; return this; }
        public AdminMetricsDtoBuilder criticalAlerts(long criticalAlerts) { this.criticalAlerts = criticalAlerts; return this; }

        public AdminMetricsDto build() {
            return new AdminMetricsDto(totalUsers, activeUsers, totalDoctors, totalHealthRecords, totalAppointments, totalAlerts, criticalAlerts);
        }
    }
}
