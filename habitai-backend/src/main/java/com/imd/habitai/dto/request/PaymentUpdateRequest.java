package com.imd.habitai.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.imd.habitai.enums.PaymentStatus;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record PaymentUpdateRequest(
    LocalDate dueDate,

    LocalDate paymentDate,

    @Positive(message = "O valor devido deve ser um valor positivo.")
    BigDecimal amountDue,

    @PositiveOrZero(message = "O valor pago não pode ser negativo.")
    BigDecimal amountPaid,

    PaymentStatus status 
) {}