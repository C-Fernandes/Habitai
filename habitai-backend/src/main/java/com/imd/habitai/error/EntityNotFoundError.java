package com.imd.habitai.error;

import org.springframework.http.HttpStatus;

public class EntityNotFoundError extends HttpError {
    public EntityNotFoundError(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
