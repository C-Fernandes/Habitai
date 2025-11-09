package com.imd.habitai.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.imd.habitai.dto.request.ContractCreateRequest;
import com.imd.habitai.dto.response.ContractResponse;
import com.imd.habitai.model.Contract;
import com.imd.habitai.model.Property;
import com.imd.habitai.model.User;

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
    Contract toEntity(ContractCreateRequest dto); 

    @Mapping(target = "payments", source = "payments")
    ContractResponse toResponse(Contract contract);

    ContractResponse.UserDTO toUserDTO(User user);
    
    @Mapping(target = "city", source = "address.city")
    @Mapping(target = "neighborhood", source = "address.neighborhood")
    @Mapping(target = "state", source = "address.state")
    ContractResponse.PropertyDTO tPropertyDTO(Property property);
    
    List<ContractResponse> toListResponses(List<Contract> contracts);
}