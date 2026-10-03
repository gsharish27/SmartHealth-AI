package com.healthmonitoring.service;

import com.healthmonitoring.dto.MedicationDTO;
import com.healthmonitoring.dto.MedicationRequest;
import com.healthmonitoring.dto.MedicationScheduleDTO;
import com.healthmonitoring.dto.PagedResponse;
import com.healthmonitoring.entity.Medication;
import com.healthmonitoring.entity.MedicationSchedule;
import com.healthmonitoring.entity.User;
import com.healthmonitoring.exception.ResourceNotFoundException;
import com.healthmonitoring.repository.MedicationRepository;
import com.healthmonitoring.repository.MedicationScheduleRepository;
import com.healthmonitoring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicationService {

    private final MedicationRepository medicationRepository;
    private final MedicationScheduleRepository scheduleRepository;
    private final UserRepository userRepository;

    @Transactional
    public MedicationDTO createMedication(Long userId, MedicationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Medication medication = Medication.builder()
                .user(user)
                .name(request.getName())
                .dosage(request.getDosage())
                .frequency(request.getFrequency())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .prescribedBy(request.getPrescribedBy())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .notes(request.getNotes())
                .build();

        Medication saved = medicationRepository.save(medication);

        // Generate default next schedule
        MedicationSchedule schedule = MedicationSchedule.builder()
                .medication(saved)
                .scheduledTime(OffsetDateTime.now().plusHours(8))
                .status("PENDING")
                .notes("Scheduled Dose")
                .build();
        scheduleRepository.save(schedule);

        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public PagedResponse<MedicationDTO> getMedications(Long userId, String status, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Medication> medPage = medicationRepository.findFiltered(userId, status, search, pageable);
        return PagedResponse.from(medPage.map(this::mapToDTO));
    }

    @Transactional
    public MedicationDTO updateMedication(Long medicationId, Long userId, MedicationRequest request) {
        Medication med = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Medication not found: " + medicationId));

        if (!med.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Medication not found for user: " + medicationId);
        }

        if (request.getName() != null) med.setName(request.getName());
        if (request.getDosage() != null) med.setDosage(request.getDosage());
        if (request.getFrequency() != null) med.setFrequency(request.getFrequency());
        if (request.getStartDate() != null) med.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) med.setEndDate(request.getEndDate());
        if (request.getPrescribedBy() != null) med.setPrescribedBy(request.getPrescribedBy());
        if (request.getStatus() != null) med.setStatus(request.getStatus());
        if (request.getNotes() != null) med.setNotes(request.getNotes());

        Medication updated = medicationRepository.save(med);
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteMedication(Long medicationId, Long userId) {
        Medication med = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Medication not found: " + medicationId));

        if (!med.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Medication not found for user: " + medicationId);
        }

        medicationRepository.delete(med);
    }

    @Transactional
    public MedicationScheduleDTO markDoseAsTaken(Long scheduleId, Long userId) {
        MedicationSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Medication schedule not found: " + scheduleId));

        if (!schedule.getMedication().getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Schedule not found for user: " + scheduleId);
        }

        schedule.setStatus("TAKEN");
        schedule.setTakenAt(OffsetDateTime.now());
        MedicationSchedule updated = scheduleRepository.save(schedule);

        return MedicationScheduleDTO.builder()
                .id(updated.getId())
                .medicationId(updated.getMedication().getId())
                .medicationName(updated.getMedication().getName())
                .dosage(updated.getMedication().getDosage())
                .scheduledTime(updated.getScheduledTime())
                .status(updated.getStatus())
                .takenAt(updated.getTakenAt())
                .notes(updated.getNotes())
                .build();
    }

    @Transactional(readOnly = true)
    public List<MedicationScheduleDTO> getUpcomingSchedules(Long userId) {
        return scheduleRepository.findUpcomingSchedulesByUserId(userId).stream()
                .map(s -> MedicationScheduleDTO.builder()
                        .id(s.getId())
                        .medicationId(s.getMedication().getId())
                        .medicationName(s.getMedication().getName())
                        .dosage(s.getMedication().getDosage())
                        .scheduledTime(s.getScheduledTime())
                        .status(s.getStatus())
                        .takenAt(s.getTakenAt())
                        .notes(s.getNotes())
                        .build())
                .collect(Collectors.toList());
    }

    public MedicationDTO mapToDTO(Medication med) {
        List<MedicationSchedule> schedules = scheduleRepository.findByMedicationIdOrderByScheduledTimeAsc(med.getId());

        OffsetDateTime nextDose = schedules.stream()
                .filter(s -> "PENDING".equalsIgnoreCase(s.getStatus()))
                .map(MedicationSchedule::getScheduledTime)
                .findFirst()
                .orElse(null);

        List<MedicationScheduleDTO> scheduleDTOs = schedules.stream().map(s -> MedicationScheduleDTO.builder()
                .id(s.getId())
                .medicationId(s.getMedication().getId())
                .medicationName(med.getName())
                .dosage(med.getDosage())
                .scheduledTime(s.getScheduledTime())
                .status(s.getStatus())
                .takenAt(s.getTakenAt())
                .notes(s.getNotes())
                .build()).collect(Collectors.toList());

        return MedicationDTO.builder()
                .id(med.getId())
                .userId(med.getUser().getId())
                .name(med.getName())
                .dosage(med.getDosage())
                .frequency(med.getFrequency())
                .startDate(med.getStartDate())
                .endDate(med.getEndDate())
                .prescribedBy(med.getPrescribedBy())
                .status(med.getStatus())
                .notes(med.getNotes())
                .nextDose(nextDose)
                .schedules(scheduleDTOs)
                .createdAt(med.getCreatedAt())
                .build();
    }
}
