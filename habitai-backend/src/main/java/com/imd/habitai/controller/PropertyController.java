package com.imd.habitai.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.imd.habitai.dto.request.PropertyCreateRequest;
import com.imd.habitai.dto.request.PropertyUpdateRequest;
import com.imd.habitai.dto.response.PropertyResponse;
import com.imd.habitai.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService, ObjectMapper objectMapper) {
        this.propertyService = propertyService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PropertyResponse> createProperty(
            @Valid @RequestPart("property") PropertyCreateRequest propertyDTO,
            @RequestPart("images") List<MultipartFile> images
    ) {
        PropertyResponse newProperty = propertyService.create(propertyDTO, images);
        return new ResponseEntity<>(newProperty, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PropertyResponse>> getAllProperties() {
        List<PropertyResponse> properties = propertyService.getAll();
        return new ResponseEntity<>(properties, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> getPropertyById(@PathVariable Long id) {
        return propertyService.getById(id)
            .map(property -> new ResponseEntity<>(property, HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyResponse> updateProperty(
        @PathVariable Long id, 
        @Valid @RequestBody PropertyUpdateRequest property) {
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