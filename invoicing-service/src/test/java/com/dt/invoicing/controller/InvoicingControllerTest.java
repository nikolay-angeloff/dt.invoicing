package com.dt.invoicing.controller;

import com.dt.invoicing.InvoicingServiceApplication;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.mock.web.MockPart;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.io.File;
import java.net.URL;
import java.nio.file.Files;

import static org.springframework.http.MediaType.TEXT_PLAIN_VALUE;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = InvoicingServiceApplication.class)
class InvoicingControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @SneakyThrows
    @Test
    public void testBadRequest() {
        MockMultipartFile file
                = new MockMultipartFile(
                "file",
                "hello.txt",
                TEXT_PLAIN_VALUE,
                "Hello, World!".getBytes()
        );

        MockMvc mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        mockMvc.perform(multipart("/api/v1/sumInvoices").file(file))
                .andExpect(status().isBadRequest());
    }

    @SneakyThrows
    @Test
    public void testValidRequest() {
        URL resource = getClass().getClassLoader().getResource("data.csv");

        byte[] fileContent = Files.readAllBytes(new File(resource.toURI()).toPath());

        MockMultipartFile file
                = new MockMultipartFile(
                "file",
                "hello.txt",
                TEXT_PLAIN_VALUE,
                fileContent
        );

        MockPart outputCurrency = new MockPart("outputCurrency", "GBP".getBytes());

        MockMvc mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        mockMvc.perform(multipart("/api/v1/sumInvoices")
                        .file(file)
                        .part(outputCurrency)
                        .param("exchangeRates", "USD:1", "EUR:2", "GBP:3"))
                .andExpect(status().is2xxSuccessful());
    }

}