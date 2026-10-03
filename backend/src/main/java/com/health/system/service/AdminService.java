package com.health.system.service;

import com.health.system.dto.AdminMetricsDto;
import com.health.system.dto.PagedResponse;
import com.health.system.dto.UserDto;
import com.health.system.entity.Role;
import com.health.system.entity.User;
import com.health.system.exception.ResourceNotFoundException;
import com.health.system.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final HealthRecordRepository healthRecordRepository;
    private final AppointmentRepository appointmentRepository;
    private final HealthAlertRepository alertRepository;

    @Transactional(readOnly = true)
    public AdminMetricsDto getSystemMetrics() {
        long totalUsers = userRepository.count();
        long totalDoctors = doctorRepository.count();
        long totalRecords = healthRecordRepository.count();
        long totalAppointments = appointmentRepository.count();
        long totalAlerts = alertRepository.count();

        return AdminMetricsDto.builder()
                .totalUsers(totalUsers)
                .activeUsers(totalUsers)
                .totalDoctors(totalDoctors)
                .totalHealthRecords(totalRecords)
                .totalAppointments(totalAppointments)
                .totalAlerts(totalAlerts)
                .criticalAlerts(Math.max(1, totalAlerts / 4))
                .build();
    }

    @Transactional(readOnly = true)
    public PagedResponse<UserDto> getUsers(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<User> usersPage = userRepository.searchUsers(search != null ? search : "", pageable);

        List<UserDto> dtos = usersPage.getContent().stream()
                .map(this::mapToUserDto)
                .collect(Collectors.toList());

        return PagedResponse.<UserDto>builder()
                .content(dtos)
                .page(usersPage.getNumber())
                .size(usersPage.getSize())
                .totalElements(usersPage.getTotalElements())
                .totalPages(usersPage.getTotalPages())
                .last(usersPage.isLast())
                .build();
    }

    @Transactional
    public UserDto toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setEnabled(!user.getEnabled());
        User saved = userRepository.save(user);
        return mapToUserDto(saved);
    }

    private UserDto mapToUserDto(User user) {
        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .enabled(user.getEnabled())
                .roles(roles)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
