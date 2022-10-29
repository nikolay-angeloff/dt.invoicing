package com.dt.invoicing.errorhandling;

import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

public enum ApiError {

    NO_DEFAULT_CURRENCY("The request does not provide a default currency!", BAD_REQUEST),
    CUSTOMER_NOT_FOUND("No such customer!", NOT_FOUND),
    CSV_FILE_INCONSISTENT_DATA("There are inconsistencies in the CSV data", BAD_REQUEST),
    CSV_FILE_CORRUPTED_DATA("The CSV file is corrupted", BAD_REQUEST),
    OUTPUT_CURRENCY_NOT_SUPPORTED("The output currency is not supported!", BAD_REQUEST),
    INCOMPLETE_EXCHANGE_CURRENCY_DATA("There are exchange rates that are missing!", BAD_REQUEST),
    EXCHANGE_CURRENCY_DATA_WRONG_FORMAT("The exchange rates are in a wrong format!", BAD_REQUEST);

    private final String message;
    private final HttpStatus code;

    ApiError(String message, HttpStatus code) {
        this.message = message;
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public HttpStatus getCode() {
        return code;
    }
}
