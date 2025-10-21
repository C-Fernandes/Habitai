package com.imd.habitai.error;

import org.springframework.http.HttpStatus;

public class AccessDeniedError extends HttpError {

    
    public AccessDeniedError(String message) {
        super(message, HttpStatus.FORBIDDEN);
    }
}