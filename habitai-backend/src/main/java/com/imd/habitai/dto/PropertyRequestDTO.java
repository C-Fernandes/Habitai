package com.imd.habitai.dto;

import com.imd.habitai.model.Address;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record PropertyRequestDTO(
    @NotBlank(message = "Título do imóvel é obrigatório")
    String title,
    
    String description,

    @NotBlank(message = "Preço do imóvel é obrigatório")
    BigDecimal rentalPrice,

    int bedrooms,
    int bathrooms,
    int garageSpaces,
    double totalArea,

    @NotNull(message = "Endereço do imóvel é obrigatório")
    Address address, 
    
    @NotNull(message = "O imóvel precisa ter um proprietário")
    Long ownerId, 
    
    List<Long> amenityIds 
) {
}