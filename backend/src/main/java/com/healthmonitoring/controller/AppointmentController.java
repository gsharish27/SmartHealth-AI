package com.healthmonitoring.controller;

import com.healthmonitoring.dto.*;
import com.healthmonitoring.security.UserPrincipal;
import com.healthmonitoring.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<AppointmentDTO>>> getAppointments(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<AppointmentDTO> result = appointmentService.getPatientAppointments(currentUser.getId(), status, page, size);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentDTO>> bookAppointment(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody AppointmentRequest request) {
        AppointmentDTO created = appointmentService.bookAppointment(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Appointment booked successfully", created));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AppointmentDTO>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String doctorNotes) {
        AppointmentDTO updated = appointmentService.updateStatus(id, status, doctorNotes);
        return ResponseEntity.ok(ApiResponse.success("Appointment status updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelAppointment(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        appointmentService.cancelAppointment(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Appointment cancelled", null));
    }
}
