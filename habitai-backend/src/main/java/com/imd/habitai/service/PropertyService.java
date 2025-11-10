package com.imd.habitai.service;

import com.imd.habitai.dto.request.PropertyCreateRequest;
import com.imd.habitai.dto.request.PropertyUpdateRequest;
import com.imd.habitai.dto.response.PropertyResponse;
import com.imd.habitai.enums.PropertyStatus;
import com.imd.habitai.mapper.PropertyMapper;
import com.imd.habitai.model.Address;
import com.imd.habitai.model.Amenity;
import com.imd.habitai.model.Property;
import com.imd.habitai.model.User;
import com.imd.habitai.repository.AmenityRepository;
import com.imd.habitai.repository.PropertyRepository;
import com.imd.habitai.repository.UserRepository;
import com.imd.habitai.repository.specification.PropertySpecification;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

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

    @Transactional
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
        property.setStatus(PropertyStatus.AVAILABLE);

        Property finalProperty = propertyRepository.save(property);
        if(!images.isEmpty()) {
            finalProperty.setImages(imageService.addImagesToProperty(finalProperty.getId(), images));
        }
        Property result = propertyRepository.findById(finalProperty.getId())
                .orElseThrow(() -> new EntityNotFoundException("Imóvel com ID " + finalProperty.getId() + " não encontrado ao tentar salvar suas imagens."));

        return propertyMapper.toDTO(result);
    }

    @Transactional(readOnly = true)
    public Page<PropertyResponse> getAll(
        String city, 
        String neighborhood, 
        BigDecimal maxPrice,
        BigDecimal minPrice,
        Pageable pageable
    ) {
        Specification<Property> spec = PropertySpecification.filterBy(city, neighborhood, maxPrice, minPrice);
        Page<Property> propertyPage = propertyRepository.findAll(spec, pageable);
        return propertyPage.map(propertyMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public Optional<PropertyResponse> getById(Long id) {
        Optional<Property> property = propertyRepository.findById(id);
        return property.map(propertyMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public Page<PropertyResponse> getPropertiesByOwner(Long userId, Pageable pageable) {
        Page<Property> propertyPage = propertyRepository.findByOwnerId(userId, pageable);
        return propertyPage.map(propertyMapper::toDTO);
    }

    @Transactional
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
                Address managedAddress = existingProperty.getAddress();
                Address detachedAddress = propertyDTO.address();

                managedAddress.setCep(detachedAddress.getCep());
                managedAddress.setStreet(detachedAddress.getStreet());
                managedAddress.setNumber(detachedAddress.getNumber());
                managedAddress.setComplement(detachedAddress.getComplement());
                managedAddress.setNeighborhood(detachedAddress.getNeighborhood());
                managedAddress.setCity(detachedAddress.getCity());
                managedAddress.setState(detachedAddress.getState());
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

    @Transactional
    public boolean delete(Long id) {
        if (propertyRepository.existsById(id)) {
            propertyRepository.deleteById(id);
            return true;
        }
        return false;
    }
}