package com.healthmonitoring.service;

import com.healthmonitoring.dto.AdminMetricsDTO;
import com.healthmonitoring.dto.PagedResponse;
import com.healthmonitoring.dto.UserDTO;
import com.healthmonitoring.entity.Role;
import com.healthmonitoring.entity.User;
import com.healthmonitoring.exception.ResourceNotFoundException;
import com.healthmonitoring.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public AdminMetricsDTO getSystemMetrics() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countActiveUsers();
        long totalDoctors = doctorRepository.count();
        long totalHealthRecords = healthRecordRepository.count();
        long totalAppointments = appointmentRepository.count();
        long totalAlerts = alertRepository.count();

        return AdminMetricsDTO.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .totalDoctors(totalDoctors)
                .totalHealthRecords(totalHealthRecords)
                .totalAppointments(totalAppointments)
                .totalAlerts(totalAlerts)
                .criticalAlerts(12)
                .systemUptimePercentage(99.98)
                .build();
    }

    @Transactional(readOnly = true)
    public PagedResponse<UserDTO> getUsers(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.findAllFiltered(search, pageable);

        Page<UserDTO> dtoPage = users.map(u -> UserDTO.builder()
                .id(u.getId())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .phoneNumber(u.getPhoneNumber())
                .avatarUrl(u.getAvatarUrl())
                .isActive(u.getIsActive())
                .roles(u.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                .createdAt(u.getCreatedAt())
                .build());

        return PagedResponse.from(dtoPage);
    }

    @Transactional
    public UserDTO toggleUserActiveStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        user.setIsActive(!user.getIsActive());
        User updated = userRepository.save(user);

        return UserDTO.builder()
                .id(updated.getId())
                .email(updated.getEmail())
                .fullName(updated.getFullName())
                .isActive(updated.getIsActive())
                .roles(updated.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                .build();
    }

    @Transactional
    public UserDTO updateUserRole(Long userId, String newRoleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        String roleStr = newRoleName.startsWith("ROLE_") ? newRoleName : "ROLE_" + newRoleName;
        Role role = roleRepository.findByName(roleStr)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleStr));

        Set<Role> roles = user.getRoles();
        roles.add(role);
        user.setRoles(roles);

        User updated = userRepository.save(user);
        return UserDTO.builder()
                .id(updated.getId())
                .email(updated.getEmail())
                .fullName(updated.getFullName())
                .isActive(updated.getIsActive())
                .roles(updated.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                .build();
    }
}
