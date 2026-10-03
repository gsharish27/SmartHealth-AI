package com.healthmonitoring.service;

import com.healthmonitoring.dto.HealthRecordDTO;
import com.healthmonitoring.dto.HealthRecordRequest;
import com.healthmonitoring.entity.HealthRecord;
import com.healthmonitoring.entity.User;
import com.healthmonitoring.repository.HealthAlertRepository;
import com.healthmonitoring.repository.HealthRecordRepository;
import com.healthmonitoring.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HealthRecordServiceTest {

    @Mock
    private HealthRecordRepository healthRecordRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private HealthAlertRepository healthAlertRepository;

    @InjectMocks
    private HealthRecordService healthRecordService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(1L)
                .email("john.doe@example.com")
                .fullName("John Doe")
                .build();
    }

    @Test
    void testCreateRecord_Success() {
        HealthRecordRequest request = HealthRecordRequest.builder()
                .heartRate(72)
                .systolicBp(120)
                .diastolicBp(80)
                .spo2(98)
                .bloodGlucose(new BigDecimal("95.0"))
                .bodyTemperature(new BigDecimal("36.6"))
                .weightKg(new BigDecimal("75.0"))
                .heightCm(new BigDecimal("178.0"))
                .sleepHours(new BigDecimal("8.0"))
                .steps(10000)
                .recordedAt(OffsetDateTime.now())
                .build();

        HealthRecord savedRecord = HealthRecord.builder()
                .id(101L)
                .user(mockUser)
                .heartRate(72)
                .systolicBp(120)
                .diastolicBp(80)
                .spo2(98)
                .recordedAt(request.getRecordedAt())
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        when(healthRecordRepository.save(any(HealthRecord.class))).thenReturn(savedRecord);

        HealthRecordDTO dto = healthRecordService.createRecord(1L, request);

        assertNotNull(dto);
        assertEquals(101L, dto.getId());
        assertEquals(72, dto.getHeartRate());
        assertEquals("120/80", dto.getBloodPressureFormatted());
        verify(healthRecordRepository, times(1)).save(any(HealthRecord.class));
    }
}
