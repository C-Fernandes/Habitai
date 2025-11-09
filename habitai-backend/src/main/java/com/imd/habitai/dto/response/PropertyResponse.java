package com.imd.habitai.dto.response;

import java.math.BigDecimal;
import java.util.List;

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
    
    List<AmenityResponse> amenities 
) {
    public record OwnerDTO(
        Long id,
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
}