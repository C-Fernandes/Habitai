package com.imd.habitai.service;

import com.imd.habitai.dto.request.VisitRequestDTO;
import com.imd.habitai.dto.response.VisitResponseDTO;
import com.imd.habitai.enums.VisitStatus;
import com.imd.habitai.model.Property;
import com.imd.habitai.model.Visit;
import com.imd.habitai.repository.PropertyRepository;
import com.imd.habitai.repository.UserRepository;
import com.imd.habitai.repository.VisitRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import com.imd.habitai.model.User;

@Service
public class VisitService {

    private final VisitRepository visitRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public VisitService(VisitRepository visitRepository,
                        PropertyRepository propertyRepository,
                        UserRepository userRepository) {
        this.visitRepository = visitRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public VisitResponseDTO createVisit(VisitRequestDTO dto, User loggedUser) {
        Property property = propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        Visit visit = new Visit();
        visit.setProperty(property);
        visit.setProspect(loggedUser);
        visit.setDateTime(dto.getDateTime());
        visit.setMessage(dto.getMessage());
        visit.setStatus(VisitStatus.SCHEDULED);

        if (dto.getAgentId() != null) {
            User agent = userRepository.findById(dto.getAgentId())
                    .orElseThrow(() -> new RuntimeException("Agent not found"));
            visit.setAgent(agent);
        }

        visit = visitRepository.save(visit);

        return mapToResponse(visit);
    }

    public List<VisitResponseDTO> getVisitsByOwner(User owner) {
        return visitRepository.findAllByPropertyOwner(owner)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public VisitResponseDTO confirmVisit(Long visitId, User owner) {
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new RuntimeException("Visit not found"));

        if (!visit.getProperty().getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("You are not allowed to confirm this visit");
        }

        visit.setStatus(VisitStatus.CONFIRMED);
        visitRepository.save(visit);

        return mapToResponse(visit);
    }

    private VisitResponseDTO mapToResponse(Visit visit) {
        VisitResponseDTO dto = new VisitResponseDTO();
        dto.setId(visit.getId());
        dto.setPropertyId(visit.getProperty().getId());
        dto.setProspectId(visit.getProspect().getId());
        dto.setAgentId(visit.getAgent() != null ? visit.getAgent().getId() : null);
        dto.setDateTime(visit.getDateTime());
        dto.setMessage(visit.getMessage());
        dto.setStatus(visit.getStatus());
        return dto;
    }
}