package com.imd.habitai.error;


import org.springframework.http.HttpStatus;

public class MethodNotAllowed extends HttpError {
    public MethodNotAllowed() {
        super("O método utilizado para esta requisição não é permitido.", HttpStatus.METHOD_NOT_ALLOWED);
    }
}