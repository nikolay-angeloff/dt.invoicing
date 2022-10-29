/* tslint:disable */
/* eslint-disable */
/**
 * Invoicing API challenge
 * Design Technologies challenges you to create an API (PHP / Java application) that lets you sum invoice documents in different currencies via a file.  This is a small task to evaluate potential hires.  ## The task  We have a **CSV** file, containing a list of invoices, debit and credit notes in different currencies. **Document structure** with **demo data** can be found in the [`data.csv`](./data.csv).  API endpoint should allow you to pass: - CSV file - A list of currencies and exchange rates (for example: `EUR:1,USD:0.987,GBP:0.878`) - An output currency (for example: `GBP`) - Filter by a specific customer by VAT number (as an optional input)  Keep in mind that the exchange rates are always based on the default currency. The default currency is specified by giving it an exchange rate of 1. EUR is used as a default currency only for the example. For example: ``` EUR = 1 EUR:USD = 0.987 EUR:GBP = 0.878 ```  The response should contain **the sum of all documents per customer**. If the optional input filter is used, the functionality should **return only the sum of the invoices for that specific customer**.  Invoice types: - 1 = invoice - 2 = credit note - 3 = debit note  Note, that if we have a credit note, it should subtract from the total of the invoice and if we have a debit note, it should add to the sum of the invoice.   ## Requirements  - The application MUST use only in memory storage. - The application MUST comply to the PSR-2 coding standard and use a PSR-4 autoloader (for PHP applications). - The application MUST be covered by unit tests. - The application MUST support different currencies. - The application MUST validate the input (for example: show an error if an unsupported currency is passed; show an error if a document has a specified parent, but the parent is missing, etc.) - OOP best practices MUST be followed. - The application MUST be supplied in a public git repository. - Setup instructions MUST be provided. - Your application MUST be fully compatible with the provided [`openapi.yaml`](./openapi.yaml) definition. - Optional: the application should have a client side, implemented in any modern JavaScript framework (e.g. React.js, Angular.js, etc.) 
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { Configuration } from './configuration';
import globalAxios, { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from './base';

/**
 * 
 * @export
 * @interface CalculateResponse
 */
export interface CalculateResponse {
    /**
     * 
     * @type {string}
     * @memberof CalculateResponse
     */
    'currency'?: string;
    /**
     * 
     * @type {Array<Customer>}
     * @memberof CalculateResponse
     */
    'customers'?: Array<Customer>;
}
/**
 * 
 * @export
 * @interface Customer
 */
export interface Customer {
    /**
     * 
     * @type {string}
     * @memberof Customer
     */
    'name': string;
    /**
     * 
     * @type {number}
     * @memberof Customer
     */
    'balance': number;
}

/**
 * DefaultApi - axios parameter creator
 * @export
 */
export const DefaultApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Sum the invoices in the document, using the provided output currencty and currency exchange rates.
         * @param {File} file The CSV file, containing a list of invoices, debit and credit notes in different currencies.
         * @param {Array<string>} exchangeRates A list of currencies and exchange rates (for example: EUR:1,USD:0.987,GBP:0.878) 
         * @param {string} outputCurrency 
         * @param {string} [customerVat] This the optional input filter. If specified, the result should contain only one customer matching the one specified in this filter. 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        sumInvoices: async (file: File, exchangeRates: Array<string>, outputCurrency: string, customerVat?: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'file' is not null or undefined
            assertParamExists('sumInvoices', 'file', file)
            // verify required parameter 'exchangeRates' is not null or undefined
            assertParamExists('sumInvoices', 'exchangeRates', exchangeRates)
            // verify required parameter 'outputCurrency' is not null or undefined
            assertParamExists('sumInvoices', 'outputCurrency', outputCurrency)
            const localVarPath = `/sumInvoices`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;
            const localVarFormParams = new ((configuration && configuration.formDataCtor) || FormData)();


            if (file !== undefined) { 
                localVarFormParams.append('file', file as any);
            }
                if (exchangeRates) {
                exchangeRates.forEach((element) => {
                    localVarFormParams.append('exchangeRates', element as any);
                })
            }

    
            if (outputCurrency !== undefined) { 
                localVarFormParams.append('outputCurrency', outputCurrency as any);
            }
    
            if (customerVat !== undefined) { 
                localVarFormParams.append('customerVat', customerVat as any);
            }
    
    
            localVarHeaderParameter['Content-Type'] = 'multipart/form-data';
    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = localVarFormParams;

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = DefaultApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Sum the invoices in the document, using the provided output currencty and currency exchange rates.
         * @param {File} file The CSV file, containing a list of invoices, debit and credit notes in different currencies.
         * @param {Array<string>} exchangeRates A list of currencies and exchange rates (for example: EUR:1,USD:0.987,GBP:0.878) 
         * @param {string} outputCurrency 
         * @param {string} [customerVat] This the optional input filter. If specified, the result should contain only one customer matching the one specified in this filter. 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async sumInvoices(file: File, exchangeRates: Array<string>, outputCurrency: string, customerVat?: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<CalculateResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.sumInvoices(file, exchangeRates, outputCurrency, customerVat, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = DefaultApiFp(configuration)
    return {
        /**
         * 
         * @summary Sum the invoices in the document, using the provided output currencty and currency exchange rates.
         * @param {File} file The CSV file, containing a list of invoices, debit and credit notes in different currencies.
         * @param {Array<string>} exchangeRates A list of currencies and exchange rates (for example: EUR:1,USD:0.987,GBP:0.878) 
         * @param {string} outputCurrency 
         * @param {string} [customerVat] This the optional input filter. If specified, the result should contain only one customer matching the one specified in this filter. 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        sumInvoices(file: File, exchangeRates: Array<string>, outputCurrency: string, customerVat?: string, options?: any): AxiosPromise<CalculateResponse> {
            return localVarFp.sumInvoices(file, exchangeRates, outputCurrency, customerVat, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
    /**
     * 
     * @summary Sum the invoices in the document, using the provided output currencty and currency exchange rates.
     * @param {File} file The CSV file, containing a list of invoices, debit and credit notes in different currencies.
     * @param {Array<string>} exchangeRates A list of currencies and exchange rates (for example: EUR:1,USD:0.987,GBP:0.878) 
     * @param {string} outputCurrency 
     * @param {string} [customerVat] This the optional input filter. If specified, the result should contain only one customer matching the one specified in this filter. 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public sumInvoices(file: File, exchangeRates: Array<string>, outputCurrency: string, customerVat?: string, options?: AxiosRequestConfig) {
        return DefaultApiFp(this.configuration).sumInvoices(file, exchangeRates, outputCurrency, customerVat, options).then((request) => request(this.axios, this.basePath));
    }
}


