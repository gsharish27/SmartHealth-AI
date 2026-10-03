package com.healthmonitoring.controller;

import com.healthmonitoring.dto.AdminMetricsDTO;
import com.healthmonitoring.dto.ApiResponse;
import com.healthmonitoring.dto.PagedResponse;
import com.healthmonitoring.dto.UserDTO;
import com.healthmonitoring.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<AdminMetricsDTO>> getSystemMetrics() {
        AdminMetricsDTO metrics = adminService.getSystemMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PagedResponse<UserDTO>>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<UserDTO> users = adminService.getUsers(search, page, size);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PatchMapping("/users/{id}/toggle-active")
    public ResponseEntity<ApiResponse<UserDTO>> toggleUserStatus(@PathVariable Long id) {
        UserDTO updated = adminService.toggleUserActiveStatus(id);
        return ResponseEntity.ok(ApiResponse.success("User active status toggled", updated));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserDTO>> updateUserRole(
            @PathVariable Long id,
            @RequestParam String role) {
        UserDTO updated = adminService.updateUserRole(id, role);
        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", updated));
    }
}
