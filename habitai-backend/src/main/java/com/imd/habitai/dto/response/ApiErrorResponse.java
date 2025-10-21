package com.imd.habitai.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiErrorResponse(
        int status,
        String error,
        String message,
        Instant timestamp,
        String path,
        Map<String, String> validationErrors) {
            
    public ApiErrorResponse(int status, String error, String message, String path) {
        this(status, error, message, Instant.now(), path, null);
    }

    public ApiErrorResponse(int status, String error, String message, String path,
            Map<String, String> validationErrors) {
        this(status, error, message, Instant.now(), path, validationErrors);
    }
}