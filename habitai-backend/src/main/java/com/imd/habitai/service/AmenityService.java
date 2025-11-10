package com.imd.habitai.service;

import com.imd.habitai.dto.request.AmenityRequest;
import com.imd.habitai.dto.response.AmenityResponse;
import com.imd.habitai.mapper.AmenityMapper;
import com.imd.habitai.model.Amenity;
import com.imd.habitai.repository.AmenityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AmenityService {
    private final AmenityRepository amenityRepository;
    private final AmenityMapper amenityMapper;

    AmenityService(
        AmenityRepository amenityRepository,
        AmenityMapper amenityMapper
    ) {
        this.amenityRepository = amenityRepository;
        this.amenityMapper = amenityMapper;
    }

    @Transactional
    public AmenityResponse create(AmenityRequest dto) {
        Amenity amenity = amenityMapper.toEntity(dto);
        Amenity savedAmenity = amenityRepository.save(amenity);
        return amenityMapper.toDTO(savedAmenity);
    }

    @Transactional(readOnly = true)
    public List<AmenityResponse> getAll() {
        List<Amenity> amenities = amenityRepository.findAll();
        return amenityMapper.toDTOList(amenities);
    }

    @Transactional(readOnly = true)
    public Optional<AmenityResponse> getById(Long id) {
        return amenityRepository.findById(id).map(amenityMapper::toDTO);
    }

    @Transactional
    public Optional<AmenityResponse> update(Long id, AmenityRequest dto) {
        return amenityRepository.findById(id)
            .map(existingAmenity -> {
                amenityMapper.updateEntityFromDTO(dto, existingAmenity);
                Amenity updatedAmenity = amenityRepository.save(existingAmenity);
                return amenityMapper.toDTO(updatedAmenity);
            });
    }


    @Transactional
    public boolean delete(Long id) {
        if (!amenityRepository.existsById(id)) return false;
        amenityRepository.deleteById(id);
        return true;
    }
}