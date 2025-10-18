package com.imd.habitai.error;

import org.springframework.http.HttpStatus;

public class BusinessException extends HttpError {
    public BusinessException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
