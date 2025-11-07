package com.imd.habitai.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.imd.habitai.dto.request.ContractCreateRequest;
import com.imd.habitai.dto.response.ContractResponse;
import com.imd.habitai.model.Contract;

@Mapper(componentModel = "spring", uses = PaymentMapper.class)
public interface ContractMapper { 
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "startDate")
    @Mapping(target = "endDate")
    @Mapping(target = "monthlyPrice")
    @Mapping(target = "paymentDueDay")
    @Mapping(target = "property", ignore = true) 
    @Mapping(target = "tenant", ignore = true) 
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "payments", ignore = true)
    public Contract toEntity(ContractCreateRequest dto); 

    public ContractResponse toDTO(Contract contract);
}