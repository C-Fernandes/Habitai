package com.imd.habitai.mapper;

import org.springframework.stereotype.Component;

import com.imd.habitai.dto.request.UserRegisterRequest;
import com.imd.habitai.dto.response.UserResponse;
import com.imd.habitai.model.User;

@Component
public class UserMapper {
    public User toEntity(UserRegisterRequest dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setCpf(dto.getCpf());
        user.setPhone(dto.getPhone());
        user.setPassword(dto.getPassword());

        return user;
    }

    public UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());

        return response;
    }
}
