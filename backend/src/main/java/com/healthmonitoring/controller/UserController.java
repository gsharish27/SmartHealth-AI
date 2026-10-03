package com.healthmonitoring.controller;

import com.healthmonitoring.dto.ApiResponse;
import com.healthmonitoring.dto.UserDTO;
import com.healthmonitoring.dto.UserProfileUpdateRequest;
import com.healthmonitoring.security.UserPrincipal;
import com.healthmonitoring.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        UserDTO userDTO = userService.getUserProfile(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(userDTO));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody UserProfileUpdateRequest request) {
        UserDTO updated = userService.updateUserProfile(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }
}
