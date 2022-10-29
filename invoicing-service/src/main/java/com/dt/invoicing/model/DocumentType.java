package com.dt.invoicing.model;

public enum DocumentType {
    INVOICE(1),
    CREDIT_NOTE(2),
    DEBIT_NOTE(3);

    private final int value;

    DocumentType(final int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static DocumentType fromValue(int value) {
        for (DocumentType documentType : DocumentType.values()) {
            if (documentType.value == value) {
                return documentType;
            }
        }
        return null;
    }
}
