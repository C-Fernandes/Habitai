package com.imd.habitai.error;

import org.springframework.http.HttpStatus;

public class RouteNotFoundError extends HttpError {
    public RouteNotFoundError() {
        super("A rota solicitada não foi encontrada.", HttpStatus.NOT_FOUND);
    }
}