package com.imd.habitai.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ContractCreateRequest(
    @NotNull(message = "A data de início é obrigatória.")
    LocalDate startDate,

    @NotNull(message = "A data de finalização é obrigatória.")
    @Future(message = "A data de finalização deve ser uma data futura.")
    LocalDate endDate,

    @NotNull(message = "O valor mensal é obrigatório.")
    @Positive(message = "O valor mensal deve ser positivo.")
    BigDecimal monthlyPrice,

    @NotNull(message = "O dia de pagamento é obrigatório.")
    @Min(value = 1, message = "O dia de pagamento não pode ser menor que 1.")
    @Max(value = 31, message = "O dia de pagamento não pode ser maior que 31.")
    int paymentDueDay,


    @NotNull(message = "O ID da propriedade é obrigatório.")
    Long propertyId, 

    @NotNull(message = "O ID do inquilino é obrigatório.")
    UUID tenantId, 

    @NotNull(message = "O ID do dono do contrato é obrigatório.")
    UUID ownerId,

    List<PaymentCreateRequest> payments
) 
{}
