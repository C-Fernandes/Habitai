package com.imd.habitai.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ContractResponse( 
    Long id,
    LocalDate startDate,
    LocalDate endDate,
    BigDecimal monthlyPrice,
    Integer paymentDueDay,
    Long propertyId, 
    Long tenantId, 
    Long ownerId,
    List<PaymentResponse> payments
)
{}