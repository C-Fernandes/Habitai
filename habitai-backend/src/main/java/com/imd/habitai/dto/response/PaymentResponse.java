package com.imd.habitai.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.imd.habitai.enums.PaymentStatus;

public record PaymentResponse(
    Long id, 
    LocalDate dueDate,
    LocalDate paymentDate,
    BigDecimal amountDue,
    BigDecimal amountPaid,
    PaymentStatus status 
) {}