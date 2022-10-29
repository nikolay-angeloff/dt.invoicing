package com.dt.invoicing.errorhandling.advice;

import com.dt.invoicing.errorhandling.exception.ApiException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ApiValidationAdvice {
    @ExceptionHandler(value = {ApiException.class})
    protected ResponseEntity<String> handleApiException(ApiException exception) {

        return new ResponseEntity<>(exception.getApiError().getMessage(), exception.getApiError().getCode());
    }
}
