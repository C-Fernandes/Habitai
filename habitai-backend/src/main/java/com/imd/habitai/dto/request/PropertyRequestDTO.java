package com.imd.habitai.dto.request;

import com.imd.habitai.model.Address;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record PropertyRequestDTO(
    @NotBlank(message = "O título não pode estar em branco.")
    @Size(min = 4, max = 120, message = "O título deve ter entre 5 e 120 caracteres.")
    String title,
    
    String description,
    
    @NotNull(message = "O preço do aluguel é obrigatório.")
    @Positive(message = "O preço do aluguel deve ser um valor positivo.")
    BigDecimal rentalPrice,
    
    @NotNull(message = "A quantidade de quartos é obrigatória.")
    @PositiveOrZero(message = "A quantidade de quartos deve ser 0 ou mais.")
    int bedrooms,
    
    @NotNull(message = "A quantidade de banheiros é obrigatória.")
    @PositiveOrZero(message = "A quantidade de banheiros deve ser 0 ou mais.")
    int bathrooms,
    
    @NotNull(message = "A quantidade de vagas de garagem é obrigatória.")
    @PositiveOrZero(message = "A quantidade de vagas de garagem deve ser 0 ou mais.")
    int garageSpaces,
    
    @NotNull(message = "A área total é obrigatória.")
    @Positive(message = "A área total deve ser um valor positivo.")
    double totalArea,
    
    @NotNull(message = "O endereço é obrigatório.")
    @Valid
    Address address,
    
    @NotNull(message = "O ID do proprietário é obrigatório.")
    Long ownerId, 
    
    List<Long> amenityIds
) {
}