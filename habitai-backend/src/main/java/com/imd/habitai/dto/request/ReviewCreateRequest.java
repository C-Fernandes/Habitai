package com.imd.habitai.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReviewCreateRequest(
    
    @NotNull(message = "O ID do imóvel é obrigatório.")
    Long propertyId,

    @NotNull(message = "A nota é obrigatória.")
    @Min(value = 1, message = "A nota mínima é 1.")
    @Max(value = 5, message = "A nota máxima é 5.")
    Integer rating,

    @Size(max = 1000, message = "O comentário não pode ter mais de 1000 caracteres.")
    String comment
) {}