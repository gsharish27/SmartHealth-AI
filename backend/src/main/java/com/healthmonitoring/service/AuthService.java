package com.healthmonitoring.service;

import com.healthmonitoring.dto.AuthResponse;
import com.healthmonitoring.dto.LoginRequest;
import com.healthmonitoring.dto.RegisterRequest;
import com.healthmonitoring.entity.Doctor;
import com.healthmonitoring.entity.HealthProfile;
import com.healthmonitoring.entity.Role;
import com.healthmonitoring.entity.User;
import com.healthmonitoring.exception.BadRequestException;
import com.healthmonitoring.repository.DoctorRepository;
import com.healthmonitoring.repository.HealthProfileRepository;
import com.healthmonitoring.repository.RoleRepository;
import com.healthmonitoring.repository.UserRepository;
import com.healthmonitoring.security.JwtTokenProvider;
import com.healthmonitoring.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final HealthProfileRepository healthProfileRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Set<String> roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        User user = userRepository.findById(userPrincipal.getId()).orElseThrow();

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .id(userPrincipal.getId())
                .email(userPrincipal.getEmail())
                .fullName(userPrincipal.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .roles(roles)
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered.");
        }

        Set<Role> roles = new HashSet<>();
        String requestedRole = request.getRole() != null ? request.getRole().toUpperCase() : "ROLE_USER";

        if (!requestedRole.startsWith("ROLE_")) {
            requestedRole = "ROLE_" + requestedRole;
        }

        Role userRole = roleRepository.findByName(requestedRole)
                .orElseGet(() -> roleRepository.findByName("ROLE_USER")
                        .orElseThrow(() -> new BadRequestException("User role not initialized.")));
        roles.add(userRole);

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .avatarUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250")
                .isActive(true)
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);

        // Initialize Health Profile
        HealthProfile profile = HealthProfile.builder()
                .user(savedUser)
                .build();
        healthProfileRepository.save(profile);

        // If registering as a doctor, create doctor entity
        if ("ROLE_DOCTOR".equalsIgnoreCase(requestedRole)) {
            Doctor doctor = Doctor.builder()
                    .user(savedUser)
                    .specialty(request.getSpecialty() != null ? request.getSpecialty() : "General Practitioner")
                    .licenseNumber(request.getLicenseNumber() != null ? request.getLicenseNumber() : "MD-" + System.currentTimeMillis())
                    .build();
            doctorRepository.save(doctor);
        }

        return login(LoginRequest.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .build());
    }
}
