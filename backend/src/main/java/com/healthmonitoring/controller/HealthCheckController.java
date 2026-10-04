package com.healthmonitoring.controller;

import com.healthmonitoring.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthCheckController {

    @GetMapping("/")
    public ResponseEntity<ApiResponse<Map<String, String>>> rootHealthCheck() {
        return ResponseEntity.ok(ApiResponse.success(
            "SmartHealth AI Backend Web Service is UP and running cleanly on Render!",
            Map.of(
                "status", "UP",
                "service", "SmartHealth-AI Backend",
                "version", "1.0.0"
            )
        ));
    }

    @GetMapping("/api/health")
    public ResponseEntity<ApiResponse<Map<String, String>>> apiHealthCheck() {
        return rootHealthCheck();
    }
}
