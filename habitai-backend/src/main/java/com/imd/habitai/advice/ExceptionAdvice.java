package com.imd.habitai.advice;


import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;

import com.imd.habitai.error.HttpError;
import com.imd.habitai.error.MethodNotAllowed;
import com.imd.habitai.error.RouteNotFound;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@ControllerAdvice
public class ExceptionAdvice {

    @ExceptionHandler(HttpError.class)
    public ResponseEntity<Map<String, Object>> handleHttpErrors(HttpError error) {
        return ResponseEntity
                .status(error.getStatus())
                .body(error.getError());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleAnnotationValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, List<String>> fieldErrors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            fieldErrors.computeIfAbsent(fieldName, k -> new ArrayList<>()).add(errorMessage);
        });

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("message", "Os dados fornecidos são inválidos.");
        responseBody.put("errors", fieldErrors);

        return new ResponseEntity<>(responseBody, HttpStatus.UNPROCESSABLE_ENTITY); 
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<Map<String, Object>> handleHandlerNotFound() {
        RouteNotFound error = new RouteNotFound();
        return ResponseEntity
                .status(error.getStatus())
                .body(error.getError());
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Map<String, Object>> handleHandlerMethodNotAllowed() {
        MethodNotAllowed error = new MethodNotAllowed();
        return ResponseEntity
                .status(error.getStatus())
                .body(error.getError());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(IllegalArgumentException ex) {
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("status", HttpStatus.BAD_REQUEST.value());
        responseBody.put("error", "Requisição Inválida");
        responseBody.put("message", ex.getMessage());

        return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDeniedException(AccessDeniedException ex) {
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("status", HttpStatus.FORBIDDEN.value());
        responseBody.put("error", "Acesso Negado");
        responseBody.put("message", "Você não tem permissão para realizar esta ação.");

        return new ResponseEntity<>(responseBody, HttpStatus.FORBIDDEN);
    }

    /*
     * @ExceptionHandler(Exception.class)
     * public ResponseEntity<Map<String, Object>> handleGenericException(Exception
     * ex) {
     * 
     * Map<String, Object> responseBody = new HashMap<>();
     * responseBody.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
     * responseBody.put("error", "Erro Interno do Servidor");
     * responseBody.put("message",
     * "Ocorreu um erro inesperado. Por favor, entre em contato com o suporte.");
     * 
     * return new ResponseEntity<>(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
     * }
     */

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex, WebRequest request) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR; 
        String message = ex.getMessage();

        ResponseStatus responseStatus = AnnotationUtils.findAnnotation(ex.getClass(), ResponseStatus.class);

        if (responseStatus != null) {
            status = responseStatus.value();
        }

        if (message == null) {
            message = "Ocorreu um erro interno no servidor.";
        }

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("status", status.value());
        responseBody.put("error", status.getReasonPhrase());
        responseBody.put("message", message); 
        responseBody.put("path", ((ServletWebRequest) request).getRequest().getRequestURI());

        return new ResponseEntity<>(responseBody, status);
    }
}