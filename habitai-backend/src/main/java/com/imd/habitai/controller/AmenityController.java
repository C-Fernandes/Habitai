package com.imd.habitai.controller;

import com.imd.habitai.dto.request.AmenityRequest;
import com.imd.habitai.dto.response.AmenityResponse;
import com.imd.habitai.service.AmenityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/amenities")
public class AmenityController {

    private final AmenityService amenityService;

    AmenityController(AmenityService amenityService) {
        this.amenityService = amenityService;
    }

    @GetMapping
    public ResponseEntity<List<AmenityResponse>> getAll() {
        List<AmenityResponse> amenities = amenityService.getAll();
        return ResponseEntity.ok(amenities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AmenityResponse> getById(@PathVariable Long id) {
        return amenityService.getById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AmenityResponse> create(@Valid @RequestBody AmenityRequest dto) {
        AmenityResponse createdAmenity = amenityService.create(dto);
        return new ResponseEntity<>(createdAmenity, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AmenityResponse> update(
            @PathVariable Long id, 
            @Valid @RequestBody AmenityRequest dto) {
        
        return amenityService.update(id, dto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (amenityService.delete(id)) return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }
}