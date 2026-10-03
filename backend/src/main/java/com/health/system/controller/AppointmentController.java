package com.health.system.controller;

import com.health.system.dto.AppointmentDto;
import com.health.system.security.UserPrincipal;
import com.health.system.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<List<AppointmentDto>> getAppointments(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(appointmentService.getPatientAppointments(principal.getId()));
    }

    @PostMapping
    public ResponseEntity<AppointmentDto> scheduleAppointment(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AppointmentDto dto
    ) {
        return ResponseEntity.ok(appointmentService.scheduleAppointment(principal.getId(), dto));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelAppointment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        appointmentService.cancelAppointment(id, principal.getId());
        return ResponseEntity.ok().build();
    }
}
