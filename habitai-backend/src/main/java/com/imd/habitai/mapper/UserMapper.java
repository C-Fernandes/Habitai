package com.imd.habitai.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.imd.habitai.dto.request.UserRegisterRequest;
import com.imd.habitai.dto.response.UserResponse;
import com.imd.habitai.model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "ownedProperties", ignore = true)
    @Mapping(target = "contractsAsOwner", ignore = true)
    @Mapping(target = "contractsAsTenant", ignore = true)
    @Mapping(target = "scheduledVisits", ignore = true)
    @Mapping(target = "accompaniedVisits", ignore = true)
    public User toEntity(UserRegisterRequest dto);

    public UserResponse toResponse(User user);
}
