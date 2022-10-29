package com.dt.invoicing.service.impl;

import com.dt.invoicing.InvoicingServiceApplication;
import com.dt.invoicing.errorhandling.exception.ApiException;
import com.dt.invoicing.model.CalculateResponse;
import com.dt.invoicing.service.InvoicingService;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;

import java.io.File;
import java.math.BigDecimal;
import java.net.URL;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.List;

import static com.dt.invoicing.errorhandling.ApiError.CUSTOMER_NOT_FOUND;
import static com.dt.invoicing.errorhandling.ApiError.EXCHANGE_CURRENCY_DATA_WRONG_FORMAT;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.http.MediaType.TEXT_PLAIN_VALUE;

@SpringBootTest(classes = InvoicingServiceApplication.class)
class InvoicingServiceImplTest {

    @Autowired
    InvoicingService invoicingService;

    @SneakyThrows
    @Test
    public void testSuccessfulCalculation() {
        //Given
        URL resource = getClass().getClassLoader().getResource("data.csv");

        byte[] fileContent = Files.readAllBytes(new File(resource.toURI()).toPath());

        MockMultipartFile file
                = new MockMultipartFile(
                "file",
                "hello.txt",
                TEXT_PLAIN_VALUE,
                fileContent
        );

        List<String> exchangeRates = Arrays.asList("USD:1", "EUR:2", "GBP:3");

        //When
        CalculateResponse result = invoicingService.calculateResponse(file, exchangeRates, "USD", null);

        //Then
        assertEquals(3, result.getCustomers().size());
        assertEquals("USD", result.getCurrency());
        assertEquals(BigDecimal.valueOf(3550).setScale(3), result.getCustomers().get(0).getBalance());
        assertEquals(BigDecimal.valueOf(1600).setScale(3), result.getCustomers().get(1).getBalance());
        assertEquals(BigDecimal.valueOf(4100).setScale(3), result.getCustomers().get(2).getBalance());
    }

    @SneakyThrows
    @Test
    public void testInvalidCustomer() {
        //Given
        URL resource = getClass().getClassLoader().getResource("data.csv");

        byte[] fileContent = Files.readAllBytes(new File(resource.toURI()).toPath());

        MockMultipartFile file
                = new MockMultipartFile(
                "file",
                "hello.txt",
                TEXT_PLAIN_VALUE,
                fileContent
        );

        List<String> exchangeRates = Arrays.asList("USD:1", "EUR:2", "GBP:3");

        //When
        ApiException apiException = assertThrows(ApiException.class, () -> invoicingService.calculateResponse(file, exchangeRates, "USD", "12"));

        //Then
        assertEquals(CUSTOMER_NOT_FOUND, apiException.getApiError());
    }

    @SneakyThrows
    @Test
    public void testWrongFormatForExchangeCurrencies() {
        //Given
        URL resource = getClass().getClassLoader().getResource("data.csv");

        byte[] fileContent = Files.readAllBytes(new File(resource.toURI()).toPath());

        MockMultipartFile file
                = new MockMultipartFile(
                "file",
                "hello.txt",
                TEXT_PLAIN_VALUE,
                fileContent
        );

        List<String> exchangeRates = Arrays.asList("USD1", "EUR:2", "GBP:3");

        //When
        ApiException apiException = assertThrows(ApiException.class, () -> invoicingService.calculateResponse(file, exchangeRates, "BGN", null));

        //Then
        assertEquals(EXCHANGE_CURRENCY_DATA_WRONG_FORMAT, apiException.getApiError());
    }

    //TODO add test methods to test all the unsuccessful scenarios
}