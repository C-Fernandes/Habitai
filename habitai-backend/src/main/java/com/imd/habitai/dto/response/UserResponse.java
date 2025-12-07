package com.imd.habitai.dto.response;

import com.imd.habitai.model.User;

public record UserResponse(
        String id,
        String phone,
        String cpf,
        String email,
        String name) {

}
