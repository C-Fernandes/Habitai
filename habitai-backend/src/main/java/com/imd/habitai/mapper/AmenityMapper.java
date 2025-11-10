package com.imd.habitai.mapper;

import com.imd.habitai.dto.request.AmenityRequest;
import com.imd.habitai.dto.response.AmenityResponse;
import com.imd.habitai.model.Amenity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AmenityMapper {
    AmenityResponse toDTO(Amenity amenity);

    List<AmenityResponse> toDTOList(List<Amenity> amenities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "properties", ignore = true)
    Amenity toEntity(AmenityRequest dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "properties", ignore = true)
    void updateEntityFromDTO(AmenityRequest dto, @MappingTarget Amenity amenity);
}