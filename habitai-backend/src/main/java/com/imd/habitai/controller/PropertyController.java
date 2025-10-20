package com.imd.habitai.controller;

import com.imd.habitai.dto.PropertyRequestDTO;
import com.imd.habitai.dto.PropertyResponseDTO;
import com.imd.habitai.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @PostMapping
    public ResponseEntity<PropertyResponseDTO> createProperty(
        @Valid @RequestBody PropertyRequestDTO property) {
        PropertyResponseDTO createdProperty = propertyService.create(property);
        return new ResponseEntity<>(createdProperty, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PropertyResponseDTO>> getAllProperties() {
        List<PropertyResponseDTO> properties = propertyService.getAll();
        return new ResponseEntity<>(properties, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponseDTO> getPropertyById(@PathVariable Long id) {
        return propertyService.getById(id)
            .map(property -> new ResponseEntity<>(property, HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyResponseDTO> updateProperty(
        @PathVariable Long id, 
        @Valid @RequestBody PropertyRequestDTO property) {
        return propertyService.update(id, property)
            .map(updatedProperty -> new ResponseEntity<>(updatedProperty, HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        if (propertyService.delete(id)) return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}