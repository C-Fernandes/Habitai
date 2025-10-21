package com.imd.habitai.service;

import com.imd.habitai.dto.request.PropertyRequestDTO;
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
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PropertyService {
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final AmenityRepository amenityRepository;
    private final PropertyMapper propertyMapper;

    public PropertyService(
        PropertyRepository propertyRepository, 
        UserRepository userRepository, 
        PropertyMapper propertyMapper,
        AmenityRepository amenityRepository
    ) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.propertyMapper = propertyMapper;
        this.amenityRepository = amenityRepository;
    }


    public PropertyResponse create(PropertyRequestDTO propertyDTO) {
        Property property = propertyMapper.toEntity(propertyDTO);
        User owner = userRepository.findById(property.getOwner().getId())
            .orElseThrow(() -> new EntityNotFoundException("Usuário (proprietário) com ID " + property.getOwner().getId() + " não encontrado."));
        
        property.setOwner(owner);

        List<Amenity> amenities = amenityRepository.findAllById(propertyDTO.amenityIds());
        if (amenities.size() != propertyDTO.amenityIds().size()) {
            throw new EntityNotFoundException("Uma ou mais comodidades não foram encontradas.");
        }
        property.setAmenities(amenities);

        propertyRepository.save(property);
        return propertyMapper.toDTO(property);
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

    public Optional<PropertyResponse> update(Long id, PropertyRequestDTO propertyDTO) {
        return propertyRepository.findById(id).map(existingProperty -> {
            Property updatedProperty = propertyMapper.toEntity(propertyDTO);
            updatedProperty.setId(id);

            User owner = userRepository.findById(propertyDTO.ownerId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário (proprietário) com ID " + propertyDTO.ownerId() + " não encontrado."));
            updatedProperty.setOwner(owner);

            List<Amenity> amenities = amenityRepository.findAllById(propertyDTO.amenityIds());
            if (amenities.size() != propertyDTO.amenityIds().size()) {
                throw new EntityNotFoundException("Uma ou mais comodidades não foram encontradas.");
            }
            updatedProperty.setAmenities(amenities);

            propertyRepository.save(updatedProperty);
            return propertyMapper.toDTO(updatedProperty);
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