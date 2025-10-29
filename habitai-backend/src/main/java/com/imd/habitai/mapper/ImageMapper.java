package com.imd.habitai.mapper;

import com.imd.habitai.dto.response.ImageResponse;
import com.imd.habitai.model.Image;
import com.imd.habitai.model.Property;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ImageMapper {

    @Mapping(source = "property", target = "propertyId", qualifiedByName = "mapPropertyToPropertyId")
    ImageResponse toDTO(Image image);

    List<ImageResponse> toDTOList(List<Image> images);

    @Named("mapPropertyToPropertyId")
    default Long mapPropertyToPropertyId(Property property) {
        return property.getId();
    }
}