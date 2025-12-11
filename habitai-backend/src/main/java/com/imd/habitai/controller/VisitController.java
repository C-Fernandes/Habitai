package com.imd.habitai.controller;
import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.imd.habitai.dto.request.VisitRequestDTO;
import com.imd.habitai.dto.response.VisitResponseDTO;
import com.imd.habitai.model.User;
import com.imd.habitai.repository.UserRepository;
import com.imd.habitai.service.VisitService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/visits")
public class VisitController {

    private final VisitService visitService;
    private final UserRepository userRepository;

    public VisitController(VisitService visitService, UserRepository userRepository) {
        this.visitService = visitService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<VisitResponseDTO> createVisit(
            @Validated(VisitRequestDTO.Create.class) @RequestBody VisitRequestDTO dto,
            Principal principal
    ) {
        String email = principal.getName();
        User user =  userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        VisitResponseDTO created = visitService.createVisit(dto, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<VisitResponseDTO>> getVisitsByPropertyUserId(
            @PathVariable Long propertyId
    ) {
        List<VisitResponseDTO> visits = visitService.getActiveVisitsByUserPropertyId(propertyId);
        return ResponseEntity.ok(visits);
    }

    @GetMapping("/user")
    public ResponseEntity<List<VisitResponseDTO>> getVisitsByUserId(Principal principal)
    {
        String email = principal.getName();
        User user =  userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        List<VisitResponseDTO> visits = visitService.getActiveVisitsByUserId(user.getId());
        return ResponseEntity.ok(visits);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VisitResponseDTO> updateVisit(
            @PathVariable Long id,
            @RequestBody @Valid VisitRequestDTO dto
    ) {
        VisitResponseDTO updatedVisit = visitService.updateVisit(id, dto);
        return ResponseEntity.ok(updatedVisit);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVisit(@PathVariable Long id) {
        visitService.deleteVisit(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<VisitResponseDTO> confirmVisit(
            @PathVariable Long id
    ) {
        VisitResponseDTO updatedVisit = visitService.confirmVisit(id);
        return ResponseEntity.ok(updatedVisit);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<VisitResponseDTO> rejectVisit(
            @PathVariable Long id
    ) {
        VisitResponseDTO updatedVisit = visitService.rejectVisit(id);
        return ResponseEntity.ok(updatedVisit);
    }
}