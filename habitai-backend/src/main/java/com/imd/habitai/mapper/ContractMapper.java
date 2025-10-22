package com.imd.habitai.mapper;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.imd.habitai.dto.request.ContractRequest;
import com.imd.habitai.dto.response.ContractResponse;
import com.imd.habitai.model.Contract;

@Mapper(componentModel = "spring")
public interface ContractMapper {    
   
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "startDate")
    @Mapping(target = "endDate")
    @Mapping(target = "monthlyPrice")
    @Mapping(target = "paymentDueDay")
    @Mapping(target = "payments", ignore = true)
    @Mapping(target = "property", ignore = true)
    @Mapping(target = "tenant", ignore = true)
    @Mapping(target = "agent", ignore = true)
    Contract toEntity(ContractRequest dto);


    ContractResponse toDTO(Contract contract);

} 