package com.healthmonitoring.controller;

import com.healthmonitoring.dto.*;
import com.healthmonitoring.security.UserPrincipal;
import com.healthmonitoring.service.HealthRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/health-records")
@RequiredArgsConstructor
public class HealthRecordController {

    private final HealthRecordService healthRecordService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<HealthRecordDTO>>> getHealthRecords(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        PagedResponse<HealthRecordDTO> records = healthRecordService.getRecords(currentUser.getId(), startDate, endDate, page, size);
        return ResponseEntity.ok(ApiResponse.success(records));
    }

    @GetMapping("/trends")
    public ResponseEntity<ApiResponse<List<VitalTrendDTO>>> getHealthTrends(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "7d") String timeRange,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime customStart,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime customEnd) {

        List<VitalTrendDTO> trends = healthRecordService.getTrends(currentUser.getId(), timeRange, customStart, customEnd);
        return ResponseEntity.ok(ApiResponse.success(trends));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HealthRecordDTO>> getRecordById(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        HealthRecordDTO record = healthRecordService.getRecordById(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(record));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<HealthRecordDTO>> createRecord(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody HealthRecordRequest request) {
        HealthRecordDTO created = healthRecordService.createRecord(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Health record logged successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HealthRecordDTO>> updateRecord(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody HealthRecordRequest request) {
        HealthRecordDTO updated = healthRecordService.updateRecord(id, currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Health record updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRecord(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        healthRecordService.deleteRecord(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Health record deleted successfully", null));
    }
}
