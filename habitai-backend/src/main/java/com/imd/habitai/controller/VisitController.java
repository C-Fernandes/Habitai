package com.imd.habitai.controller;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.imd.habitai.dto.request.VisitRequestDTO;
import com.imd.habitai.dto.response.VisitResponseDTO;
import com.imd.habitai.model.User;
import com.imd.habitai.service.VisitService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/visits")
public class VisitController {

    private final VisitService visitService;

    public VisitController(VisitService visitService) {
        this.visitService = visitService;
    }

    @PostMapping
    public ResponseEntity<VisitResponseDTO> createVisit(
            @Validated(VisitRequestDTO.Create.class) @RequestBody VisitRequestDTO dto
    ) {
        VisitResponseDTO created = visitService.createVisit(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<VisitResponseDTO>> getVisitsByPropertyUserId(
            @PathVariable Long propertyId
    ) {
        List<VisitResponseDTO> visits = visitService.getActiveVisitsByUserPropertyId(propertyId);
        return ResponseEntity.ok(visits);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<VisitResponseDTO>> getVisitsByUserId(@PathVariable Long id) {
        List<VisitResponseDTO> visits = visitService.getActiveVisitsByUserId(id);
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