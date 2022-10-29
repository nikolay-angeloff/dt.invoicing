package com.dt.invoicing.model;

import java.math.BigDecimal;

public record InvoiceRecord(String customer,
                            Integer vatNumber,
                            Long documentNumber,
                            DocumentType type,
                            Long parentDocument,
                            String currency,
                            BigDecimal total) {
}
