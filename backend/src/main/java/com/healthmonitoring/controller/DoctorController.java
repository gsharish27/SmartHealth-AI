package com.healthmonitoring.controller;

import com.healthmonitoring.dto.*;
import com.healthmonitoring.security.UserPrincipal;
import com.healthmonitoring.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping("/doctors")
    public ResponseEntity<ApiResponse<List<DoctorDTO>>> getActiveDoctors() {
        List<DoctorDTO> doctors = doctorService.getAllActiveDoctors();
        return ResponseEntity.ok(ApiResponse.success(doctors));
    }

    @GetMapping("/patients")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<DoctorPatientDTO>>> getDoctorPatients(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<DoctorPatientDTO> patients = doctorService.getDoctorPatients(currentUser.getId(), search, page, size);
        return ResponseEntity.ok(ApiResponse.success(patients));
    }

    @GetMapping("/patients/{patientId}/overview")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<PatientOverviewDTO>> getPatientOverview(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long patientId) {
        PatientOverviewDTO overview = doctorService.getPatientHealthOverview(currentUser.getId(), patientId);
        return ResponseEntity.ok(ApiResponse.success(overview));
    }

    @PostMapping("/access/grant")
    public ResponseEntity<ApiResponse<Void>> grantAccess(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam Long doctorId) {
        doctorService.grantAccess(currentUser.getId(), doctorId);
        return ResponseEntity.ok(ApiResponse.success("Access granted to doctor", null));
    }
}
