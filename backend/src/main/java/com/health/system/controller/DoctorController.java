package com.health.system.controller;

import com.health.system.dto.PatientOverviewDto;
import com.health.system.security.UserPrincipal;
import com.health.system.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping("/patients")
    public ResponseEntity<List<PatientOverviewDto>> getAssignedPatients(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(doctorService.getAssignedPatients(principal.getId()));
    }

    @GetMapping("/patients/{patientId}/overview")
    public ResponseEntity<PatientOverviewDto> getPatientOverview(@PathVariable Long patientId) {
        return ResponseEntity.ok(doctorService.getPatientOverview(patientId));
    }
}
