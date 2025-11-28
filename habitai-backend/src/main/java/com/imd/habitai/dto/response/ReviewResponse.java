package com.imd.habitai.dto.response;

import java.time.LocalDateTime;

public record ReviewResponse(
    Long id,
    Integer rating,
    String comment,
    LocalDateTime createdAt,
    AuthorDTO author
) {
    public record AuthorDTO(
        Long id,
        String name
    ) {}
}