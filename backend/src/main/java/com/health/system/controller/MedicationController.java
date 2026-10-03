package com.health.system.controller;

import com.health.system.dto.MedicationDto;
import com.health.system.security.UserPrincipal;
import com.health.system.service.MedicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<List<MedicationDto>> getUserMedications(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(medicationService.getUserMedications(principal.getId()));
    }

    @PostMapping
    public ResponseEntity<MedicationDto> createMedication(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody MedicationDto dto
    ) {
        return ResponseEntity.ok(medicationService.createMedication(principal.getId(), dto));
    }

    @PostMapping("/{id}/take")
    public ResponseEntity<MedicationDto> markAsTaken(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(medicationService.markDoseAsTaken(id, principal.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedication(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        medicationService.deleteMedication(id, principal.getId());
        return ResponseEntity.noContent().build();
    }
}
