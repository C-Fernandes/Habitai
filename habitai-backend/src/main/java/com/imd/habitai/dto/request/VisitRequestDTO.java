package com.imd.habitai.dto.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
public class VisitRequestDTO {

    @NotNull
    private Long propertyId;

    @NotNull
    private LocalDateTime dateTime;

    private String message;

    private Long agentId; // opcional, caso queira atribuir um agente

    // getters e setters
    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getAgentId() { return agentId; }
    public void setAgentId(Long agentId) { this.agentId = agentId; }
}