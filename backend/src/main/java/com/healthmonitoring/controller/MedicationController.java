package com.healthmonitoring.controller;

import com.healthmonitoring.dto.*;
import com.healthmonitoring.security.UserPrincipal;
import com.healthmonitoring.service.MedicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medications")
@RequiredArgsConstructor
public class MedicationController {

    private final MedicationService medicationService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<MedicationDTO>>> getMedications(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        PagedResponse<MedicationDTO> result = medicationService.getMedications(currentUser.getId(), status, search, page, size);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<MedicationScheduleDTO>>> getUpcomingSchedules(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<MedicationScheduleDTO> upcoming = medicationService.getUpcomingSchedules(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(upcoming));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MedicationDTO>> createMedication(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody MedicationRequest request) {
        MedicationDTO created = medicationService.createMedication(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Medication added successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicationDTO>> updateMedication(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody MedicationRequest request) {
        MedicationDTO updated = medicationService.updateMedication(id, currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Medication updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMedication(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        medicationService.deleteMedication(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Medication removed successfully", null));
    }

    @PostMapping("/schedules/{scheduleId}/take")
    public ResponseEntity<ApiResponse<MedicationScheduleDTO>> markDoseAsTaken(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long scheduleId) {
        MedicationScheduleDTO schedule = medicationService.markDoseAsTaken(scheduleId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Dose logged as taken", schedule));
    }
}
