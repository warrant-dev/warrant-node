import ApiError from "./types/ApiError";
import { UserRequestOptions } from "./types/Params";

const { version } = require("../package.json");

interface HttpClient {
    get(requestOptions: HttpClientRequestOptions): Promise<any>;
    delete(requestOptions: HttpClientRequestOptions): Promise<any>;
    post(requestOptions: HttpClientRequestOptions): Promise<any>;
    put(requestOptions: HttpClientRequestOptions): Promise<any>;
}

export interface HttpClientConfig {
    apiKey: string;
    baseUrl: string;
}

export interface HttpClientRequestOptions {
    apiKey?: string;
    baseUrl?: string;
    data?: any;
    params?: any;
    url: string;
    options?: UserRequestOptions;
}

interface RequestHeaders {
    [header: string]: string;
}

interface FetchRequestOptions {
    method: "GET" | "POST" | "PUT" | "DELETE";
    headers: RequestHeaders;
    body?: string;
}

export default class ApiClient implements HttpClient {
    private config: HttpClientConfig;

    constructor(config: HttpClientConfig) {
        this.config = config;
    }

    public async get(requestOptions: HttpClientRequestOptions): Promise<any> {
        const [requestUrl, fetchRequestOptions] = this.buildRequestUrlAndOptions("GET", requestOptions);

        /* @ts-ignore */
        const response = await fetch(requestUrl, fetchRequestOptions);
        if (!response.ok) {
            throw this.buildError(await response.json());
        }

        return this.parseResponse(response);
    }

    public async delete(requestOptions: HttpClientRequestOptions): Promise<any> {
        const [requestUrl, fetchRequestOptions] = this.buildRequestUrlAndOptions("DELETE", requestOptions);

        /* @ts-ignore */
        const response = await fetch(requestUrl, fetchRequestOptions);
        if (!response.ok) {
            throw this.buildError(await response.json());
        }

        return this.parseResponse(response);
    }

    public async post(requestOptions: HttpClientRequestOptions): Promise<any> {
        const [requestUrl, fetchRequestOptions] = this.buildRequestUrlAndOptions("POST", requestOptions);

        /* @ts-ignore */
        const response = await fetch(requestUrl, fetchRequestOptions);
        if (!response.ok) {
            throw this.buildError(await response.json());
        }

        return this.parseResponse(response);
    }

    public async put(requestOptions: HttpClientRequestOptions): Promise<any> {
        const [requestUrl, fetchRequestOptions] = this.buildRequestUrlAndOptions("PUT", requestOptions);

        /* @ts-ignore */
        const response = await fetch(requestUrl, fetchRequestOptions);
        if (!response.ok) {
            throw this.buildError(await response.json());
        }

        return this.parseResponse(response);
    }

    private buildRequestUrlAndOptions(method: FetchRequestOptions["method"], requestOptions?: HttpClientRequestOptions): [string, FetchRequestOptions] {
        let baseUrl = this.config.baseUrl;
        const fetchRequestOptions: FetchRequestOptions = {
            method,
            headers: {
                'User-Agent': `warrant-node/${version}`,
                'Content-Type': "application/json"
            },
        };

        if (requestOptions?.apiKey) {
            fetchRequestOptions.headers['Authorization'] = `ApiKey ${requestOptions.apiKey}`;
        } else if (this.config.apiKey) {
            fetchRequestOptions.headers['Authorization'] = `ApiKey ${this.config.apiKey}`;
        }

        if (requestOptions?.baseUrl) {
            baseUrl = requestOptions.baseUrl;
        }

        if (requestOptions?.options?.warrantToken) {
            fetchRequestOptions.headers['Warrant-Token'] = requestOptions.options.warrantToken;
        }

        let requestUrl = `${baseUrl}${requestOptions.url}`;
        if (requestOptions?.params) {
            const queryParams = new URLSearchParams(requestOptions.params);
            requestUrl += `?${queryParams}`;
        }

        if (method !== "GET" && requestOptions.data) {
            if (Object.keys(requestOptions.data).length === 0) {
                fetchRequestOptions.body = "{}";
            } else {
                fetchRequestOptions.body = JSON.stringify(requestOptions.data);
            }
        }

        return [requestUrl, fetchRequestOptions];
    }

    private async parseResponse(response: any): Promise<string | Object> {
        const resJson = await response.text();
        if (resJson) {
            return JSON.parse(resJson);
        }

        return resJson;
    }

    private buildError(errorResponse: any): Error {
        return new ApiError(errorResponse.code, errorResponse.message);
    }
}
