package com.dt.invoicing.controller;

import com.dt.invoicing.api.SumInvoicesApi;
import com.dt.invoicing.model.CalculateResponse;
import com.dt.invoicing.service.InvoicingService;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

@RestController
@RequestMapping("/api/v1")
@Log4j2
@RequiredArgsConstructor
public class InvoicingController implements SumInvoicesApi {

    private final InvoicingService invoicingService;

    @Override
    @PostMapping(
            value = "/sumInvoices",
            produces = {APPLICATION_JSON_VALUE},
            consumes = {MULTIPART_FORM_DATA_VALUE}
    )
    public ResponseEntity<CalculateResponse> sumInvoices(@ApiParam(value = "The CSV file, containing a list of invoices, debit and credit notes in different currencies.") @Valid @RequestPart(value = "file") MultipartFile file,
                                                         @ApiParam(value = "A list of currencies and exchange rates (for example: EUR:1,USD:0.987,GBP:0.878) ", required = true) @Valid @RequestParam(value = "exchangeRates") List<String> exchangeRates,
                                                         @ApiParam(required = true) @Valid @RequestPart(value = "outputCurrency") String outputCurrency,
                                                         @ApiParam(value = "This the optional input filter. If specified, the result should contain only one customer matching the one specified in this filter. ") @Valid @RequestPart(value = "customerVat", required = false) String customerVat) {

        return ResponseEntity.of(Optional.of(invoicingService.calculateResponse(file, exchangeRates, outputCurrency, customerVat)));

    }

}
