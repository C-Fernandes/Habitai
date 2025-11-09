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
    public VisitResponseDTO createVisit(VisitRequestDTO dto) {
        Property property = propertyRepository.findByIdWithOwner(dto.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        User propertyUser = userRepository.findById(property.getOwner().getId())
                .orElseThrow(() -> new RuntimeException("Property owner not found"));

        property.getOwner().getId();

        Visit visit = new Visit();
        visit.setProperty(property);
        visit.setPropertyUser(propertyUser);
        visit.setUser(user);
        visit.setDateTime(dto.getDateTime());
        visit.setMessage(dto.getMessage());
        visit.setStatus(VisitStatus.SCHEDULED);

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
    public VisitResponseDTO confirmVisit(Long visitId) {
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new RuntimeException("Visit not found"));

        visit.setStatus(VisitStatus.CONFIRMED);
        visitRepository.save(visit);

        return mapToResponse(visit);
    }

    @Transactional
    public VisitResponseDTO updateVisit(Long id, VisitRequestDTO dto) {
        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found"));

        if (visit.getStatus() == VisitStatus.CANCELED) {
            throw new RuntimeException("Cannot edit a cancelled visit");
        }

        visit.setDateTime(dto.getDateTime());
        visit.setMessage(dto.getMessage());
        visit.setStatus(VisitStatus.SCHEDULED);

        return mapToResponse(visitRepository.save(visit));
    }

    @Transactional
    public void deleteVisit(Long id) {
        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found"));
        visit.setStatus(VisitStatus.CANCELED);
        visitRepository.save(visit);
    }

    public List<VisitResponseDTO> getActiveVisitsByUserPropertyId(Long propertyUserId) {
        return visitRepository.findAllByPropertyUserId(propertyUserId).stream()
                .filter(visit -> visit.getStatus() != VisitStatus.CANCELED
                        && visit.getStatus() != VisitStatus.REJECTED)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<VisitResponseDTO> getActiveVisitsByUserId(Long userId) {
        return visitRepository.findAllByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    @Transactional
    public VisitResponseDTO confirmVisit(Long visitId, Long ownerId) {
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new RuntimeException("Visit not found"));

        if (!visit.getProperty().getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Você não tem permissão para confirmar esta visita");
        }

        visit.setStatus(VisitStatus.CONFIRMED);
        visitRepository.save(visit);

        return mapToResponse(visit);
    }

    @Transactional
    public VisitResponseDTO rejectVisit(Long visitId) {
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new RuntimeException("Visit not found"));

        visit.setStatus(VisitStatus.REJECTED);
        visitRepository.save(visit);

        return mapToResponse(visit);
    }

    private VisitResponseDTO mapToResponse(Visit visit) {
        VisitResponseDTO dto = new VisitResponseDTO();

        dto.setId(visit.getId());
        dto.setPropertyId(visit.getProperty().getId());
        dto.setDateTime(visit.getDateTime());
        dto.setMessage(visit.getMessage());
        dto.setStatus(visit.getStatus());

        if (visit.getUser() != null) {
            dto.setUserId(visit.getUser().getId());
            dto.setUserName(visit.getUser().getName());
        }

        if (visit.getPropertyUser() != null) {
            dto.setPropertyUserId(visit.getPropertyUser().getId());
            dto.setPropertyUserName(visit.getPropertyUser().getName());
        }

        return dto;
    }
}