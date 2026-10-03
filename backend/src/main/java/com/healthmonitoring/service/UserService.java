package com.healthmonitoring.service;

import com.healthmonitoring.dto.HealthProfileDTO;
import com.healthmonitoring.dto.UserDTO;
import com.healthmonitoring.dto.UserProfileUpdateRequest;
import com.healthmonitoring.entity.HealthProfile;
import com.healthmonitoring.entity.User;
import com.healthmonitoring.exception.ResourceNotFoundException;
import com.healthmonitoring.repository.HealthProfileRepository;
import com.healthmonitoring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final HealthProfileRepository healthProfileRepository;

    @Transactional(readOnly = true)
    public UserDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        HealthProfile profile = healthProfileRepository.findByUserId(userId)
                .orElse(null);

        return mapToUserDTO(user, profile);
    }

    @Transactional
    public UserDTO updateUserProfile(Long userId, UserProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());

        HealthProfile profile = healthProfileRepository.findByUserId(userId)
                .orElseGet(() -> HealthProfile.builder().user(user).build());

        if (request.getDateOfBirth() != null) profile.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) profile.setGender(request.getGender());
        if (request.getBloodGroup() != null) profile.setBloodGroup(request.getBloodGroup());
        if (request.getHeightCm() != null) profile.setHeightCm(request.getHeightCm());
        if (request.getWeightKg() != null) profile.setWeightKg(request.getWeightKg());
        if (request.getEmergencyContactName() != null) profile.setEmergencyContactName(request.getEmergencyContactName());
        if (request.getEmergencyContactRelationship() != null) profile.setEmergencyContactRelationship(request.getEmergencyContactRelationship());
        if (request.getEmergencyContactPhone() != null) profile.setEmergencyContactPhone(request.getEmergencyContactPhone());
        if (request.getAllergies() != null) profile.setAllergies(request.getAllergies());
        if (request.getMedicalHistory() != null) profile.setMedicalHistory(request.getMedicalHistory());

        healthProfileRepository.save(profile);
        userRepository.save(user);

        return mapToUserDTO(user, profile);
    }

    public UserDTO mapToUserDTO(User user, HealthProfile profile) {
        HealthProfileDTO profileDTO = null;

        if (profile != null) {
            Integer age = null;
            if (profile.getDateOfBirth() != null) {
                age = Period.between(profile.getDateOfBirth(), LocalDate.now()).getYears();
            }

            profileDTO = HealthProfileDTO.builder()
                    .id(profile.getId())
                    .dateOfBirth(profile.getDateOfBirth())
                    .age(age)
                    .gender(profile.getGender())
                    .bloodGroup(profile.getBloodGroup())
                    .heightCm(profile.getHeightCm())
                    .weightKg(profile.getWeightKg())
                    .emergencyContactName(profile.getEmergencyContactName())
                    .emergencyContactRelationship(profile.getEmergencyContactRelationship())
                    .emergencyContactPhone(profile.getEmergencyContactPhone())
                    .allergies(profile.getAllergies())
                    .medicalHistory(profile.getMedicalHistory())
                    .targetHeartRateMin(profile.getTargetHeartRateMin())
                    .targetHeartRateMax(profile.getTargetHeartRateMax())
                    .targetSystolicMax(profile.getTargetSystolicMax())
                    .targetDiastolicMax(profile.getTargetDiastolicMax())
                    .targetSpo2Min(profile.getTargetSpo2Min())
                    .targetGlucoseMax(profile.getTargetGlucoseMax())
                    .build();
        }

        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl())
                .isActive(user.getIsActive())
                .roles(user.getRoles().stream().map(r -> r.getName()).collect(Collectors.toSet()))
                .createdAt(user.getCreatedAt())
                .profile(profileDTO)
                .build();
    }
}
