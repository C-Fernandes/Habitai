package com.imd.habitai.error;

import org.springframework.http.HttpStatus;

public class EntityNotFound extends HttpError {
    public EntityNotFound(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
