package com.imd.habitai.service;

import com.imd.habitai.dto.PropertyRequestDTO;
import com.imd.habitai.mapper.PropertyMapper;
import com.imd.habitai.model.Amenity;
import com.imd.habitai.model.Property;
import com.imd.habitai.model.User;
import com.imd.habitai.repository.AmenityRepository;
import com.imd.habitai.repository.PropertyRepository;
import com.imd.habitai.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

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


    public Property create(PropertyRequestDTO propertyDTO) {
        Property property = propertyMapper.toEntity(propertyDTO);
        User owner = userRepository.findById(property.getOwner().getId())
            .orElseThrow(() -> new EntityNotFoundException("Usuário (proprietário) com ID " + property.getOwner().getId() + " não encontrado."));
        
        property.setOwner(owner);

        List<Amenity> amenities = amenityRepository.findAllById(propertyDTO.amenityIds());
        if (amenities.size() != propertyDTO.amenityIds().size()) {
            throw new EntityNotFoundException("Uma ou mais comodidades não foram encontradas.");
        }
        property.setAmenities(amenities);

        return propertyRepository.save(property);
    }

    public List<Property> getAll() {
        return propertyRepository.findAll();
    }

    public Optional<Property> getById(Long id) {
        return propertyRepository.findById(id);
    }

    @Transactional
    public Optional<Property> update(Long id, PropertyRequestDTO property) {
        return null;
        // Ainda fazer
    }

    @Transactional
    public boolean delete(Long id) {
        if (propertyRepository.existsById(id)) {
            propertyRepository.deleteById(id);
            return true;
        }
        return false;
    }
}