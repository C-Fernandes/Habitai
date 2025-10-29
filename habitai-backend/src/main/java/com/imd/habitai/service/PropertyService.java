package com.imd.habitai.service;

import com.imd.habitai.dto.request.PropertyCreateRequest;
import com.imd.habitai.dto.request.PropertyUpdateRequest;
import com.imd.habitai.dto.response.PropertyResponse;
import com.imd.habitai.mapper.PropertyMapper;
import com.imd.habitai.model.Amenity;
import com.imd.habitai.model.Property;
import com.imd.habitai.model.User;
import com.imd.habitai.repository.AmenityRepository;
import com.imd.habitai.repository.PropertyRepository;
import com.imd.habitai.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PropertyService {
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final AmenityRepository amenityRepository;
    private final PropertyMapper propertyMapper;
    private final ImageService imageService;

    public PropertyService(
            PropertyRepository propertyRepository,
            UserRepository userRepository,
            PropertyMapper propertyMapper,
            AmenityRepository amenityRepository, ImageService imageService
    ) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.propertyMapper = propertyMapper;
        this.amenityRepository = amenityRepository;
        this.imageService = imageService;
    }

    public PropertyResponse create(PropertyCreateRequest propertyDTO, List<MultipartFile> images) {
        Property property = propertyMapper.toEntity(propertyDTO);
        User owner = userRepository.findById(property.getOwner().getId())
            .orElseThrow(() -> new EntityNotFoundException("Usuário (proprietário) com ID " + property.getOwner().getId() + " não encontrado."));
        
        property.setOwner(owner);

        List<Amenity> amenities = amenityRepository.findAllById(propertyDTO.amenityIds());
        if (amenities.size() != propertyDTO.amenityIds().size()) {
            throw new EntityNotFoundException("Uma ou mais comodidades não foram encontradas.");
        }
        property.setAmenities(amenities);

        Property finalProperty = propertyRepository.save(property);
        if(!images.isEmpty()) {
            finalProperty.setImages(imageService.addImagesToProperty(finalProperty.getId(), images));
        }
        Property result = propertyRepository.findById(finalProperty.getId())
                .orElseThrow(() -> new EntityNotFoundException("Imóvel com ID " + finalProperty.getId() + " não encontrado ao tentar salvar suas imagens."));

        return propertyMapper.toDTO(result);
    }

    public List<PropertyResponse> getAll() {
        return propertyRepository.findAll().stream()
            .map(propertyMapper::toDTO)
            .collect(Collectors.toList());
    }

    public Optional<PropertyResponse> getById(Long id) {
        Optional<Property> property = propertyRepository.findById(id);
        return property.map(propertyMapper::toDTO);
    }

    public Optional<PropertyResponse> update(Long id, PropertyUpdateRequest propertyDTO) {
        return propertyRepository.findById(id).map(existingProperty -> {
            if (propertyDTO.title() != null) {
                existingProperty.setTitle(propertyDTO.title());
            }
            if (propertyDTO.description() != null) {
                existingProperty.setDescription(propertyDTO.description());
            }
            if (propertyDTO.rentalPrice() != null) {
                existingProperty.setRentalPrice(propertyDTO.rentalPrice());
            }
            if (propertyDTO.bedrooms() != null) {
                existingProperty.setBedrooms(propertyDTO.bedrooms());
            }
            if (propertyDTO.bathrooms() != null) {
                existingProperty.setBathrooms(propertyDTO.bathrooms());
            }
            if (propertyDTO.garageSpaces() != null) {
                existingProperty.setGarageSpaces(propertyDTO.garageSpaces());
            }
            if (propertyDTO.totalArea() != null) {
                existingProperty.setTotalArea(propertyDTO.totalArea());
            }
            if (propertyDTO.address() != null) {
                existingProperty.setAddress(propertyDTO.address());
            }

            if (propertyDTO.amenityIds() != null) {
                List<Amenity> amenities = amenityRepository.findAllById(propertyDTO.amenityIds());
                if (amenities.size() != propertyDTO.amenityIds().size()) {
                    throw new EntityNotFoundException("Uma ou mais comodidades não foram encontradas.");
                }
                existingProperty.setAmenities(amenities);
            }

            Property savedProperty = propertyRepository.save(existingProperty);
            
            return propertyMapper.toDTO(savedProperty);
        });
    }

    public boolean delete(Long id) {
        if (propertyRepository.existsById(id)) {
            propertyRepository.deleteById(id);
            return true;
        }
        return false;
    }
}