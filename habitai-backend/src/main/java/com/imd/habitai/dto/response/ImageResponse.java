package com.imd.habitai.dto.response;

public record ImageResponse(
        Long id,
        String imagePath,
        String contentType,
        Long propertyId
) {
}
