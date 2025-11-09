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
    PropertyDTO property, 
    UserDTO tenant, 
    UserDTO owner,
    List<PaymentResponse> payments
){
    public record UserDTO(
        String name,
        String phone,
        String email,
        String cpf
    ) {}

    public record PropertyDTO(
        Long id,
        String title,
        BigDecimal rentalPrice,
        String state,
        String city,
        String neighborhood
    ){}
}