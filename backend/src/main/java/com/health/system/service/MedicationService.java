package com.health.system.service;

import com.health.system.dto.MedicationDto;
import com.health.system.entity.Medication;
import com.health.system.entity.MedicationSchedule;
import com.health.system.entity.User;
import com.health.system.exception.ResourceNotFoundException;
import com.health.system.repository.MedicationRepository;
import com.health.system.repository.MedicationScheduleRepository;
import com.health.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicationService {

    private final MedicationRepository medicationRepository;
    private final MedicationScheduleRepository scheduleRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<MedicationDto> getUserMedications(Long userId) {
        return medicationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public MedicationDto createMedication(Long userId, MedicationDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Medication med = Medication.builder()
                .user(user)
                .name(dto.getName())
                .dosage(dto.getDosage())
                .frequency(dto.getFrequency())
                .instructions(dto.getInstructions())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .status("ACTIVE")
                .build();

        Medication saved = medicationRepository.save(med);

        // Initial dose schedule
        MedicationSchedule schedule = MedicationSchedule.builder()
                .medication(saved)
                .scheduledTime(LocalDateTime.now().plusHours(4))
                .taken(false)
                .build();
        scheduleRepository.save(schedule);

        return mapToDto(saved);
    }

    @Transactional
    public MedicationDto markDoseAsTaken(Long medicationId, Long userId) {
        Medication med = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Medication not found"));

        if (!med.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Medication not found for user");
        }

        List<MedicationSchedule> schedules = scheduleRepository.findByMedicationIdOrderByScheduledTimeAsc(medicationId);
        if (!schedules.isEmpty()) {
            MedicationSchedule latest = schedules.get(schedules.size() - 1);
            latest.setTaken(true);
            latest.setTakenAt(LocalDateTime.now());
            scheduleRepository.save(latest);
        }

        return mapToDto(med);
    }

    @Transactional
    public void deleteMedication(Long id, Long userId) {
        Medication med = medicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medication not found"));
        if (!med.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Medication not found for user");
        }
        medicationRepository.delete(med);
    }

    private MedicationDto mapToDto(Medication med) {
        List<MedicationSchedule> schedules = scheduleRepository.findByMedicationIdOrderByScheduledTimeAsc(med.getId());
        LocalDateTime nextTime = schedules.isEmpty() ? LocalDateTime.now().plusHours(8) : schedules.get(schedules.size() - 1).getScheduledTime();
        Boolean taken = schedules.isEmpty() ? false : schedules.get(schedules.size() - 1).getTaken();

        return MedicationDto.builder()
                .id(med.getId())
                .userId(med.getUser().getId())
                .name(med.getName())
                .dosage(med.getDosage())
                .frequency(med.getFrequency())
                .instructions(med.getInstructions())
                .startDate(med.getStartDate())
                .endDate(med.getEndDate())
                .status(med.getStatus())
                .nextDose(nextTime)
                .nextDoseTaken(taken)
                .createdAt(med.getCreatedAt())
                .build();
    }
}
