package com.imd.habitai.dto.response;
public record UserResponse (
    Long id,
    String name,
    String email,
    String phone
) {}
