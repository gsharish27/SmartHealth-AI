package com.healthmonitoring.controller;

import com.healthmonitoring.dto.AlertDTO;
import com.healthmonitoring.dto.ApiResponse;
import com.healthmonitoring.dto.PagedResponse;
import com.healthmonitoring.security.UserPrincipal;
import com.healthmonitoring.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<AlertDTO>>> getUserAlerts(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) String level,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<AlertDTO> alerts = alertService.getUserAlerts(currentUser.getId(), level, page, size);
        return ResponseEntity.ok(ApiResponse.success(alerts));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<AlertDTO>>> getRecentAlerts(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<AlertDTO> recent = alertService.getRecentUserAlerts(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(recent));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAlertAsRead(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        alertService.markAlertAsRead(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Alert marked as read", null));
    }
}
