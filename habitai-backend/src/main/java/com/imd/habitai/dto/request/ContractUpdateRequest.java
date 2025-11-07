package com.imd.habitai.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.imd.habitai.model.Payment;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;

public record ContractUpdateRequest(
    Long id,
    LocalDate startDate,

    @Future(message = "A data de finalização deve ser uma data futura.")
    LocalDate endDate,

    @Positive(message = "O valor mensal deve ser positivo.")
    BigDecimal monthlyPrice,

    @Min(value = 1, message = "O dia de pagamento não pode ser menor que 1.")
    @Max(value = 31, message = "O dia de pagamento não pode ser maior que 31.")
    int paymentDueDay,

    Long propertyId, 
    Long tenantId, 
    Long ownerId,
    List<Payment> payments
) 
{}
