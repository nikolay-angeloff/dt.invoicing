package com.dt.invoicing.errorhandling.exception;

import com.dt.invoicing.errorhandling.ApiError;

public class ApiException extends RuntimeException {

    private ApiError apiError;

    public ApiException(ApiError apiError) {
        this.apiError = apiError;
    }

    public ApiError getApiError() {
        return apiError;
    }
}
