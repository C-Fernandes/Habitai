package com.imd.habitai.error;

import org.springframework.http.HttpStatus;

public class InvalidCredentialsError extends HttpError {
    public InvalidCredentialsError(String message) {
        super(message, HttpStatus.UNAUTHORIZED);
    }

}
