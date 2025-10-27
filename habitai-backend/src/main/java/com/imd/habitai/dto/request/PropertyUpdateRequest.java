package com.imd.habitai.dto.request;

import com.imd.habitai.model.Address;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record PropertyUpdateRequest(
    @Size(min = 4, max = 120, message = "O título deve ter entre 5 e 120 caracteres.")
    String title,
    
    String description,
    
    @Positive(message = "O preço do aluguel deve ser um valor positivo.")
    BigDecimal rentalPrice,
    
    @PositiveOrZero(message = "A quantidade de quartos deve ser 0 ou mais.")
    Integer bedrooms,
    
    @PositiveOrZero(message = "A quantidade de banheiros deve ser 0 ou mais.")
    Integer bathrooms,
    
    @PositiveOrZero(message = "A quantidade de vagas de garagem deve ser 0 ou mais.")
    Integer garageSpaces,
    
    @Positive(message = "A área total deve ser um valor positivo.")
    Double totalArea,
    
    @Valid
    Address address,
    
    List<Long> amenityIds
) {
}