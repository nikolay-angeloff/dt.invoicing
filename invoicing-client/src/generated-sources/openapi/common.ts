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


import { Configuration } from "./configuration";
import { RequiredError, RequestArgs } from "./base";
import { AxiosInstance, AxiosResponse } from 'axios';

/**
 *
 * @export
 */
export const DUMMY_BASE_URL = 'https://example.com'

/**
 *
 * @throws {RequiredError}
 * @export
 */
export const assertParamExists = function (functionName: string, paramName: string, paramValue: unknown) {
    if (paramValue === null || paramValue === undefined) {
        throw new RequiredError(paramName, `Required parameter ${paramName} was null or undefined when calling ${functionName}.`);
    }
}

/**
 *
 * @export
 */
export const setApiKeyToObject = async function (object: any, keyParamName: string, configuration?: Configuration) {
    if (configuration && configuration.apiKey) {
        const localVarApiKeyValue = typeof configuration.apiKey === 'function'
            ? await configuration.apiKey(keyParamName)
            : await configuration.apiKey;
        object[keyParamName] = localVarApiKeyValue;
    }
}

/**
 *
 * @export
 */
export const setBasicAuthToObject = function (object: any, configuration?: Configuration) {
    if (configuration && (configuration.username || configuration.password)) {
        object["auth"] = { username: configuration.username, password: configuration.password };
    }
}

/**
 *
 * @export
 */
export const setBearerAuthToObject = async function (object: any, configuration?: Configuration) {
    if (configuration && configuration.accessToken) {
        const accessToken = typeof configuration.accessToken === 'function'
            ? await configuration.accessToken()
            : await configuration.accessToken;
        object["Authorization"] = "Bearer " + accessToken;
    }
}

/**
 *
 * @export
 */
export const setOAuthToObject = async function (object: any, name: string, scopes: string[], configuration?: Configuration) {
    if (configuration && configuration.accessToken) {
        const localVarAccessTokenValue = typeof configuration.accessToken === 'function'
            ? await configuration.accessToken(name, scopes)
            : await configuration.accessToken;
        object["Authorization"] = "Bearer " + localVarAccessTokenValue;
    }
}

function setFlattenedQueryParams(urlSearchParams: URLSearchParams, parameter: any, key: string = ""): void {
    if (typeof parameter === "object") {
        if (Array.isArray(parameter)) {
            (parameter as any[]).forEach(item => setFlattenedQueryParams(urlSearchParams, item, key));
        } 
        else {
            Object.keys(parameter).forEach(currentKey => 
                setFlattenedQueryParams(urlSearchParams, parameter[currentKey], `${key}${key !== '' ? '.' : ''}${currentKey}`)
            );
        }
    } 
    else {
        if (urlSearchParams.has(key)) {
            urlSearchParams.append(key, parameter);
        } 
        else {
            urlSearchParams.set(key, parameter);
        }
    }
}

/**
 *
 * @export
 */
export const setSearchParams = function (url: URL, ...objects: any[]) {
    const searchParams = new URLSearchParams(url.search);
    setFlattenedQueryParams(searchParams, objects);
    url.search = searchParams.toString();
}

/**
 *
 * @export
 */
export const serializeDataIfNeeded = function (value: any, requestOptions: any, configuration?: Configuration) {
    const nonString = typeof value !== 'string';
    const needsSerialization = nonString && configuration && configuration.isJsonMime
        ? configuration.isJsonMime(requestOptions.headers['Content-Type'])
        : nonString;
    return needsSerialization
        ? JSON.stringify(value !== undefined ? value : {})
        : (value || "");
}

/**
 *
 * @export
 */
export const toPathString = function (url: URL) {
    return url.pathname + url.search + url.hash
}

/**
 *
 * @export
 */
export const createRequestFunction = function (axiosArgs: RequestArgs, globalAxios: AxiosInstance, BASE_PATH: string, configuration?: Configuration) {
    return <T = unknown, R = AxiosResponse<T>>(axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
        const axiosRequestArgs = {...axiosArgs.options, url: (configuration?.basePath || basePath) + axiosArgs.url};
        return axios.request<T, R>(axiosRequestArgs);
    };
}
