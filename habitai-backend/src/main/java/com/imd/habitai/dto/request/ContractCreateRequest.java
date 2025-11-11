package com.imd.habitai.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.hibernate.validator.constraints.br.CPF;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

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

    @NotBlank(message = "O CPF não pode estar em branco.")
    @Size(min = 11, max = 14, message = "O CPF deve ter 11 dígitos.")
    @CPF(message = "O CPF informado do inquilino é inválido.") 
    String tenantCpf,

    @NotBlank(message = "O CPF não pode estar em branco.")
    @Size(min = 11, max = 14, message = "O CPF deve ter 11 dígitos.")
    @CPF(message = "O CPF informado do dono é inválido.") 
    String ownerCpf,

    List<PaymentCreateRequest> payments
) 
{}
