package com.imd.habitai.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.imd.habitai.dto.request.PropertyCreateRequest;
import com.imd.habitai.dto.request.PropertyUpdateRequest;
import com.imd.habitai.dto.response.PropertyResponse;
import com.imd.habitai.model.User;
import com.imd.habitai.repository.UserRepository;
import com.imd.habitai.service.PropertyService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/properties")
public class PropertyController {

    private final PropertyService propertyService;
    private final UserRepository userRepository;

    public PropertyController(PropertyService propertyService, ObjectMapper objectMapper, UserRepository userRepository) {
        this.userRepository = userRepository;
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
    public ResponseEntity<Page<PropertyResponse>> getAllProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String neighborhood,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) BigDecimal minPrice,
            @PageableDefault(size = 9, page = 0) Pageable pageable
    ) {
        Page<PropertyResponse> propertyPage = propertyService.getAll(city, neighborhood, maxPrice, minPrice, pageable);
        return new ResponseEntity<>(propertyPage, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> getPropertyById(@PathVariable Long id) {
        return propertyService.getById(id)
            .map(property -> new ResponseEntity<>(property, HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/my-properties/{maybeUserId}")
    public ResponseEntity<Page<PropertyResponse>> getMyProperties(
        @PageableDefault(size = 12, sort = "id") Pageable pageable,
        @PathVariable Long maybeUserId,
        Principal principal
    ) {
        String email = principal.getName();
        User user =  userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        Page<PropertyResponse> propertyPage = propertyService.getPropertiesByOwner(maybeUserId, user.getId(), pageable);
        return new ResponseEntity<>(propertyPage, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyResponse> updateProperty(
        @PathVariable Long id, 
        @Valid @RequestBody PropertyUpdateRequest property,
        Principal principal
    ) {
        String email = principal.getName();
        User user =  userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        return propertyService.update(id, property, user.getId())
            .map(updatedProperty -> new ResponseEntity<>(updatedProperty, HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(
        @PathVariable Long id,
        Principal principal
    ) {
        String email = principal.getName();
        User user =  userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        propertyService.delete(id, user.getId());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}