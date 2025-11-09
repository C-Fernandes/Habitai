package com.imd.habitai.controller;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
            @Valid @RequestBody VisitRequestDTO dto
    ) {
        VisitResponseDTO response = visitService.createVisit(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/owner")
    public ResponseEntity<List<VisitResponseDTO>> getVisitsByOwner(User loggedUser
    ) {
        List<VisitResponseDTO> visits = visitService.getVisitsByOwner(loggedUser);
        return ResponseEntity.ok(visits);
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<VisitResponseDTO> confirmVisit(
            @PathVariable Long id, User loggedUser
    ) {
        VisitResponseDTO response = visitService.confirmVisit(id, loggedUser);
        return ResponseEntity.ok(response);
    }
}