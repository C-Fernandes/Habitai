package com.imd.habitai.error;

import org.springframework.http.HttpStatus;

public class BusinessExceptionError extends HttpError {
    public BusinessExceptionError(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
