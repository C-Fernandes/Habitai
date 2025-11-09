package com.imd.habitai.dto.response;
import java.time.LocalDateTime;
import java.util.UUID;

import com.imd.habitai.enums.VisitStatus;

public class VisitResponseDTO {
    private Long id;
    private Long propertyId;
    private UUID prospectId;
    private UUID agentId;
    private LocalDateTime dateTime;
    private VisitStatus status;
    private String message;

    // getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public UUID getProspectId() { return prospectId; }
    public void setProspectId(UUID prospectId) { this.prospectId = prospectId; }

    public UUID getAgentId() { return agentId; }
    public void setAgentId(UUID agentId) { this.agentId = agentId; }

    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }

    public VisitStatus getStatus() { return status; }
    public void setStatus(VisitStatus status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}