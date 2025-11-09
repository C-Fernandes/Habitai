package com.imd.habitai.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.hibernate.validator.constraints.br.CPF;

import com.imd.habitai.model.Payment;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record ContractUpdateRequest(
    LocalDate startDate,

    @Future(message = "A data de finalização deve ser uma data futura.")
    LocalDate endDate,

    @Positive(message = "O valor mensal deve ser positivo.")
    BigDecimal monthlyPrice,

    @Min(value = 1, message = "O dia de pagamento não pode ser menor que 1.")
    @Max(value = 31, message = "O dia de pagamento não pode ser maior que 31.")
    Integer paymentDueDay,

    Long propertyId, 

    @Size(min = 11, max = 14, message = "O CPF deve ter 11 dígitos.")
    @CPF(message = "O CPF informado do inquilino é inválido.") 
    String tenantCpf,

    @Size(min = 11, max = 14, message = "O CPF deve ter 11 dígitos.")
    @CPF(message = "O CPF informado do dono é inválido.") 
    String ownerCpf,

    List<Payment> payments
) 
{}
