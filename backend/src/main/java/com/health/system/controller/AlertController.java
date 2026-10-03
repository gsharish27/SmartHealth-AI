package com.health.system.controller;

import com.health.system.dto.HealthAlertDto;
import com.health.system.security.UserPrincipal;
import com.health.system.service.AlertService;
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
    public ResponseEntity<List<HealthAlertDto>> getAlerts(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(alertService.getUserAlerts(principal.getId()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(alertService.getUnreadCount(principal.getId()));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        alertService.markAsRead(id, principal.getId());
        return ResponseEntity.ok().build();
    }
}
