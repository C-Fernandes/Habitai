package com.imd.habitai.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record ContractResponse( 
    Long id,
    LocalDate startDate,
    LocalDate endDate,
    BigDecimal monthlyPrice,
    Integer paymentDueDay,
    Long propertyId, 
    UUID tenantId, 
    UUID ownerId,
    List<PaymentResponse> payments
)
{}