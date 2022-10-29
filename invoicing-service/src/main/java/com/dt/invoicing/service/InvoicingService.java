package com.dt.invoicing.service;

import com.dt.invoicing.model.CalculateResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface InvoicingService {

    CalculateResponse calculateResponse(MultipartFile file, List<String> exchangeRates, String outputCurrency, String customerVat);

}
