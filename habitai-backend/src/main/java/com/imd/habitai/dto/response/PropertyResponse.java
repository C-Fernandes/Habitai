package com.imd.habitai.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record PropertyResponse(
    Long id,
    String title,
    String description,
    BigDecimal rentalPrice,
    int bedrooms,
    int bathrooms,
    int garageSpaces,
    double totalArea,
    
    AddressDTO address,
    
    OwnerDTO owner,

    List<ImageResponse> images,
    
    List<AmenityDTO> amenities 
) {
    public record OwnerDTO(
        UUID id,
        String name,
        String phone,
        String email
    ) {}

    public record AddressDTO(
        Long id,
        String street,
        String city,
        String state,
        String cep,
        String number,
        String complement,
        String neighborhood
    ) {}

    public record AmenityDTO(
        Long id,
        String name
    ) {}
}