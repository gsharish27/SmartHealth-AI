package com.health.system.controller;

import com.health.system.dto.HealthRecordDto;
import com.health.system.dto.PagedResponse;
import com.health.system.dto.VitalSummaryDto;
import com.health.system.security.UserPrincipal;
import com.health.system.service.HealthRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/health-records")
@RequiredArgsConstructor
public class HealthRecordController {

    private final HealthRecordService healthRecordService;

    @GetMapping
    public ResponseEntity<PagedResponse<HealthRecordDto>> getHealthRecords(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "recordedAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        return ResponseEntity.ok(healthRecordService.getHealthRecords(
                principal.getId(), search, startDate, endDate, page, size, sortBy, sortDir
        ));
    }

    @GetMapping("/vitals-summary")
    public ResponseEntity<List<VitalSummaryDto>> getDashboardVitalSummaries(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(healthRecordService.getDashboardVitalSummaries(principal.getId()));
    }

    @PostMapping
    public ResponseEntity<HealthRecordDto> createRecord(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody HealthRecordDto dto
    ) {
        return ResponseEntity.ok(healthRecordService.createHealthRecord(principal.getId(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HealthRecordDto> updateRecord(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody HealthRecordDto dto
    ) {
        return ResponseEntity.ok(healthRecordService.updateHealthRecord(id, principal.getId(), dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        healthRecordService.deleteHealthRecord(id, principal.getId());
        return ResponseEntity.noContent().build();
    }
}
