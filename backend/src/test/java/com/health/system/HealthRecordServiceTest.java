package com.health.system;

import com.health.system.dto.HealthRecordDto;
import com.health.system.dto.PagedResponse;
import com.health.system.entity.HealthRecord;
import com.health.system.entity.User;
import com.health.system.repository.HealthRecordRepository;
import com.health.system.repository.UserRepository;
import com.health.system.service.AlertService;
import com.health.system.service.HealthRecordService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class HealthRecordServiceTest {

    @Mock
    private HealthRecordRepository recordRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AlertService alertService;

    @InjectMocks
    private HealthRecordService recordService;

    private User testUser;
    private HealthRecord testRecord;
    private HealthRecordDto testDto;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("john@example.com");
        testUser.setFullName("John Doe");

        testRecord = new HealthRecord();
        testRecord.setId(100L);
        testRecord.setUser(testUser);
        testRecord.setHeartRate(72);
        testRecord.setSystolicBp(120);
        testRecord.setDiastolicBp(80);
        testRecord.setRecordedAt(LocalDateTime.now());

        testDto = new HealthRecordDto();
        testDto.setHeartRate(72);
        testDto.setSystolicBp(120);
        testDto.setDiastolicBp(80);
        testDto.setRecordedAt(LocalDateTime.now());
    }

    @Test
    void testCreateRecord_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(recordRepository.save(any(HealthRecord.class))).thenReturn(testRecord);

        HealthRecordDto created = recordService.createRecord(1L, testDto);

        assertNotNull(created);
        assertEquals(72, created.getHeartRate());
        assertEquals(120, created.getSystolicBp());
        verify(recordRepository, times(1)).save(any(HealthRecord.class));
        verify(alertService, times(1)).evaluateAndCreateAlerts(any(HealthRecord.class));
    }

    @Test
    void testGetUserRecords_Paginated() {
        Page<HealthRecord> page = new PageImpl<>(Collections.singletonList(testRecord), PageRequest.of(0, 10), 1);
        when(recordRepository.findByUserId(eq(1L), any(Pageable.class))).thenReturn(page);

        PagedResponse<HealthRecordDto> response = recordService.getUserRecords(1L, 0, 10, "recordedAt", "desc", null);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        assertEquals(1, response.getTotalElements());
        assertEquals(72, response.getContent().get(0).getHeartRate());
    }

    @Test
    void testDeleteRecord_Success() {
        when(recordRepository.findById(100L)).thenReturn(Optional.of(testRecord));

        recordService.deleteRecord(1L, 100L);

        verify(recordRepository, times(1)).delete(testRecord);
    }
}
