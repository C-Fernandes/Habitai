package com.imd.habitai.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.imd.habitai.enums.PaymentStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record PaymentCreateRequest(
    @NotNull(message = "A data de vencimento é obrigatória.")
    LocalDate dueDate,

    @NotNull(message = "A data de pagamento é obrigatória.")
    LocalDate paymentDate,

    @NotNull(message = "O valor devido é obrigatório.")
    @Positive(message = "O valor devido deve ser um valor positivo.")
    BigDecimal amountDue,

    @PositiveOrZero(message = "O valor pago não pode ser negativo.")
    BigDecimal amountPaid,

    @NotNull(message = "O status de pagamento é obrigatório.")
    PaymentStatus status 
) {}