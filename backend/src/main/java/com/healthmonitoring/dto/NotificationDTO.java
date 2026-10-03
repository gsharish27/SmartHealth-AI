package com.healthmonitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

    private Long id;
    private Long userId;
    private String title;
    private String message;
    private String type; // INFO, WARNING, SUCCESS, ALERT
    private Boolean isRead;
    private OffsetDateTime createdAt;
}
