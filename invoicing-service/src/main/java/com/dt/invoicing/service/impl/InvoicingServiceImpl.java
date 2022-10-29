package com.dt.invoicing.service.impl;

import com.dt.invoicing.errorhandling.exception.ApiException;
import com.dt.invoicing.model.CalculateResponse;
import com.dt.invoicing.model.Customer;
import com.dt.invoicing.model.DocumentType;
import com.dt.invoicing.model.InvoiceRecord;
import com.dt.invoicing.service.InvoicingService;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.RequestScope;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import static com.dt.invoicing.errorhandling.ApiError.*;
import static com.dt.invoicing.model.DocumentType.CREDIT_NOTE;
import static java.math.BigDecimal.ZERO;
import static java.nio.charset.StandardCharsets.UTF_8;
import static org.apache.commons.csv.CSVFormat.DEFAULT;

@Service
@RequestScope
@Log4j2
public class InvoicingServiceImpl implements InvoicingService {

    private final Map<String, Double> currencyExchangeRates = new HashMap<>();

    private final List<InvoiceRecord> invoiceRecords = new ArrayList<>();

    private String outputCurrency;

    private String customerVat;

    //Used for validation
    private final Map<Integer, String> customerVats = new HashMap<>();

    //Used for validation
    private final Set<String> invoiceCurrencies = new HashSet<>();

    //Used for validation
    private final Set<Long> documentNumbers = new HashSet<>();

    @Override
    public CalculateResponse calculateResponse(MultipartFile file, List<String> exchangeRates, String outputCurrency, String customerVat) {

        this.outputCurrency = outputCurrency;

        this.customerVat = customerVat;

        parseExchangeRates(exchangeRates);

        parseInvoices(file);

        validate();

        //First group the invoices by customer
        Map<String, List<InvoiceRecord>> invoicesGroupedByCustomer = invoiceRecords.stream().collect(Collectors.groupingBy(InvoiceRecord::customer));

        List<Customer> customers = new ArrayList<>();

        for (String customerKey : invoicesGroupedByCustomer.keySet()) {
            Customer initialCustomerState = new Customer();
            initialCustomerState.setBalance(ZERO);
            initialCustomerState.setName(customerKey);

            //Performing the aggregation for each customer grouped list
            Customer customerResult = invoicesGroupedByCustomer.get(customerKey).stream().reduce(initialCustomerState, (partialCustomerState, invoiceRecord) -> {
                //Convert to default currency and then add or subtract depending on the invoice type
                //TODO Consider strategy pattern for the different operations
                if (CREDIT_NOTE.equals(invoiceRecord.type())) {
                    partialCustomerState.setBalance(partialCustomerState
                            .getBalance()
                            .subtract(invoiceRecord.total().multiply(BigDecimal.valueOf(currencyExchangeRates.get(invoiceRecord.currency())))));
                } else {
                    partialCustomerState.setBalance(partialCustomerState
                            .getBalance()
                            .add(invoiceRecord.total().multiply(BigDecimal.valueOf(currencyExchangeRates.get(invoiceRecord.currency())))));
                }

                return partialCustomerState;

            }, (partialCustomerState, partialCustomerState2) -> {
                Customer result = new Customer();
                result.setBalance(partialCustomerState.getBalance().add(partialCustomerState2.getBalance()));
                return result;
            });

            customerResult.setBalance(customerResult.getBalance().multiply(BigDecimal.valueOf(currencyExchangeRates.get(outputCurrency))));

            customers.add(customerResult);
        }

        if (customerVat != null) {
            customers = customers.stream().filter(customer -> customer.getName().equals(customerVats.get(Integer.parseInt(customerVat)))).toList();
        }

        CalculateResponse response = new CalculateResponse();
        response.setCustomers(customers);
        response.setCurrency(outputCurrency);

        return response;
    }

    private void parseInvoices(MultipartFile file) {

        BufferedReader fileReader;

        try {
            fileReader = new BufferedReader(new
                    InputStreamReader(file.getInputStream(), UTF_8));
        } catch (IOException e) {
            throw new ApiException(CSV_FILE_CORRUPTED_DATA);
        }

        CSVParser csvParser;

        try {
            csvParser = new CSVParser(fileReader, DEFAULT);
        } catch (IOException e) {
            throw new ApiException(CSV_FILE_CORRUPTED_DATA);
        }

        Iterable<CSVRecord> csvRecords;

        try {
            csvRecords = csvParser.getRecords();
        } catch (IOException e) {
            throw new ApiException(CSV_FILE_CORRUPTED_DATA);
        }

        boolean headerLinePassed = false;

        for (CSVRecord csvRecord : csvRecords) {

            if (!headerLinePassed) {
                headerLinePassed = true;
                continue;
            }

            try {
                InvoiceRecord invoiceRecord = new InvoiceRecord(csvRecord.get(0),
                        Integer.parseInt(csvRecord.get(1)),
                        Long.parseLong(csvRecord.get(2)),
                        DocumentType.fromValue(Integer.parseInt(csvRecord.get(3))),
                        !csvRecord.get(4).isEmpty() ? Long.parseLong(csvRecord.get(4)) : null,
                        csvRecord.get(5),
                        BigDecimal.valueOf(Double.parseDouble(csvRecord.get(6))));

                invoiceRecords.add(invoiceRecord);

                invoiceCurrencies.add(invoiceRecord.currency());

                customerVats.put(invoiceRecord.vatNumber(), invoiceRecord.customer());

                documentNumbers.add(invoiceRecord.documentNumber());
            } catch (NumberFormatException e) {
                throw new ApiException(CSV_FILE_CORRUPTED_DATA);
            }
        }
    }

    private void parseExchangeRates(List<String> exchangeRates) {

        for (String exchangeRatePair : exchangeRates) {

            String[] exchangeRate = exchangeRatePair.split(":");

            if (exchangeRate.length != 2) {
                throw new ApiException(EXCHANGE_CURRENCY_DATA_WRONG_FORMAT);
            }

            try {
                currencyExchangeRates.put(exchangeRate[0], Double.parseDouble(exchangeRate[1]));
            } catch (NumberFormatException e) {
                throw new ApiException(EXCHANGE_CURRENCY_DATA_WRONG_FORMAT);
            }
        }
    }

    private void validate() {

        validateOutputCurrency();

        validateCustomer();

        validateExchangeRates();

        validateInvoices();

        //TODO add validation if there is mismatch between customer names and VATs

    }

    private void validateOutputCurrency() {

        if (!currencyExchangeRates.containsKey(outputCurrency)) {
            throw new ApiException(OUTPUT_CURRENCY_NOT_SUPPORTED);
        }
    }

    private void validateCustomer() {

        if (customerVat != null && !customerVats.keySet().contains(Integer.parseInt(customerVat))) {
            throw new ApiException(CUSTOMER_NOT_FOUND);
        }
    }

    private void validateExchangeRates() {

        if (!currencyExchangeRates.keySet().containsAll(invoiceCurrencies)) {
            throw new ApiException(INCOMPLETE_EXCHANGE_CURRENCY_DATA);
        }

        if (!currencyExchangeRates.containsValue(1.0D)) {
            throw new ApiException(NO_DEFAULT_CURRENCY);
        }
    }

    private void validateInvoices() {

        for (InvoiceRecord invoiceRecord : invoiceRecords) {
            if (invoiceRecord.parentDocument() != null && !documentNumbers.contains(invoiceRecord.parentDocument())) {
                throw new ApiException(CSV_FILE_INCONSISTENT_DATA);
            }
        }
    }

}
