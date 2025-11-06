package com.imd.habitai.dto.response;

public record UserResponse(
                String id,
                String phone, String cpf, String email, 
                String name) {
}
