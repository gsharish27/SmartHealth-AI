package com.healthmonitoring.controller;

import com.healthmonitoring.dto.ApiResponse;
import com.healthmonitoring.dto.HealthOverviewDTO;
import com.healthmonitoring.security.UserPrincipal;
import com.healthmonitoring.service.AlertService;
import com.healthmonitoring.service.AppointmentService;
import com.healthmonitoring.service.HealthRecordService;
import com.healthmonitoring.service.MedicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalTime;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final HealthRecordService healthRecordService;
    private final AlertService alertService;
    private final AppointmentService appointmentService;
    private final MedicationService medicationService;

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<HealthOverviewDTO>> getDashboardOverview(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        Long userId = currentUser.getId();
        int hour = LocalTime.now().getHour();
        String timeOfDay = (hour < 12) ? "morning" : (hour < 17) ? "afternoon" : "evening";

        String greeting = "Good " + timeOfDay + ", " + currentUser.getFullName();
        String subhead = "Here's your health overview for today.";

        HealthOverviewDTO overview = HealthOverviewDTO.builder()
                .userName(currentUser.getFullName())
                .greeting(greeting)
                .subhead(subhead)
                .vitalCards(healthRecordService.getVitalCards(userId))
                .recentAlerts(alertService.getRecentUserAlerts(userId))
                .upcomingAppointments(appointmentService.getUpcomingAppointments(userId))
                .todaysMedications(medicationService.getMedications(userId, "ACTIVE", null, 0, 5).getContent())
                .build();

        return ResponseEntity.ok(ApiResponse.success(overview));
    }
}
