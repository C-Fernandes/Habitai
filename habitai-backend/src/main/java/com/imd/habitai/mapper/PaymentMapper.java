package com.imd.habitai.mapper;

import com.imd.habitai.dto.request.PaymentCreateRequest;
import com.imd.habitai.dto.response.PaymentResponse;
import com.imd.habitai.model.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring") 
public interface PaymentMapper {
    @Mapping(target = "contract", ignore = true)
    @Mapping(target = "id", ignore = true)
    Payment toEntity(PaymentCreateRequest request);
    

    List<Payment> toEntityList(List<PaymentCreateRequest> requestList);

    PaymentResponse toResponse(Payment entity);

    List<PaymentResponse> toResponseList(List<Payment> entityList);
}