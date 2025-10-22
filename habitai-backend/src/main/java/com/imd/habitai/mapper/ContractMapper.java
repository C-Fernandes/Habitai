package com.imd.habitai.mapper;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.imd.habitai.dto.request.ContractRequest;
import com.imd.habitai.model.Contract;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Mapper(componentModel = "spring")
public interface ContractMapper {    
   
    @Mapping(target = "id")
    @Mapping(target = "startDate")
    @Mapping(target = "endDate")
    @Mapping(target = "monthlyPrice")
    @Mapping(target = "paymentDueDay")
    Contract toEntity(ContractRequest dto);
} 