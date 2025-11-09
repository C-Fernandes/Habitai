package com.imd.habitai.dto.response;
import java.time.LocalDateTime;

import com.imd.habitai.enums.VisitStatus;

public class VisitResponseDTO {
    private Long id;
    private LocalDateTime dateTime;
    private VisitStatus status;
    private Long propertyId;
    private Long propertyUserId;
    private String propertyUserName;
    private String message;
    private Long userId;
    private String userName;

    // getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }

    public VisitStatus getStatus() { return status; }
    public void setStatus(VisitStatus status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getPropertyUserId() {
        return propertyUserId;
    }
    public void setPropertyUserId(Long propertyUserId) {
        this.propertyUserId = propertyUserId;
    }

    public String getPropertyUserName() {
        return propertyUserName;
    }

    public void setPropertyUserName(String propertyUserName) {
        this.propertyUserName = propertyUserName;
    }

    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
}