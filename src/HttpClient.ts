import ApiError from "./types/ApiError";
import { WarrantRequestOptions } from "./types/WarrantRequestOptions";

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
    options?: WarrantRequestOptions;
}

interface RequestHeaders {
    [header: string]: string;
}

interface FetchRequestOptions {
    method: "GET" | "POST" | "PUT" | "DELETE";
    headers: RequestHeaders;
    body?: string;
}

const MAX_RETRY_ATTEMPTS = 3;
const BACKOFF_MULTIPLIER = 1.5;
const MINIMUM_SLEEP_TIME = 500;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default class ApiClient implements HttpClient {
    private config: HttpClientConfig;

    constructor(config: HttpClientConfig) {
        this.config = config;
    }

    public async get(requestOptions: HttpClientRequestOptions): Promise<any> {
        const [requestUrl, fetchRequestOptions] = this.buildRequestUrlAndOptions("GET", requestOptions);

        const response = await this.fetchWithRetry(requestUrl, fetchRequestOptions);

        return this.parseResponse(response);
    }

    public async delete(requestOptions: HttpClientRequestOptions): Promise<any> {
        const [requestUrl, fetchRequestOptions] = this.buildRequestUrlAndOptions("DELETE", requestOptions);

        const response = await this.fetchWithRetry(requestUrl, fetchRequestOptions);

        return this.parseResponse(response);
    }

    public async post(requestOptions: HttpClientRequestOptions): Promise<any> {
        const [requestUrl, fetchRequestOptions] = this.buildRequestUrlAndOptions("POST", requestOptions);

        const response = await this.fetchWithRetry(requestUrl, fetchRequestOptions);

        return this.parseResponse(response);
    }

    public async put(requestOptions: HttpClientRequestOptions): Promise<any> {
        const [requestUrl, fetchRequestOptions] = this.buildRequestUrlAndOptions("PUT", requestOptions);

        const response = await this.fetchWithRetry(requestUrl, fetchRequestOptions);

        return this.parseResponse(response);
    }

    private async fetchWithRetry(requestUrl: string, fetchRequestOptions: FetchRequestOptions): Promise<any> {
        let response: any = null;
        let requestError: any = null;
        let retryAttempts = 1;

        const makeRequest = async (): Promise<any> => {
            try {
                response = await fetch(requestUrl, fetchRequestOptions);
            } catch (e) {
                requestError = e;
            }

            if (this.shouldRetryRequest(response, requestError, retryAttempts)) {
                retryAttempts++;
                await sleep(this.getSleepTime(retryAttempts));
                return makeRequest();
            }

            if (!response.ok) {
                throw this.buildError(await response.json());
            }

            return response;
        }

        return makeRequest();
    }

    private shouldRetryRequest(response: any, requestError: any, retryAttempt: number): boolean {
        if (retryAttempt > MAX_RETRY_ATTEMPTS) {
            return false;
        }

        if (requestError != null && requestError instanceof TypeError) {
            return true;
        }

        if (response?.status == 502) {
            return true;
        }

        return false;
    }

    private getSleepTime(retryAttempt: number): number {
        let sleepTime = MINIMUM_SLEEP_TIME * Math.pow(BACKOFF_MULTIPLIER, retryAttempt);
        const jitter = Math.random() + 0.5;
        return sleepTime * jitter;
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
        const warrantToken = response.headers.get("Warrant-Token");
        if (resJson) {
            const parsedRes = JSON.parse(resJson);
            if (warrantToken != null) {
                if (Array.isArray(parsedRes)) {
                    for (const res of parsedRes) {
                        res.warrantToken = warrantToken;
                    }
                } else {
                    parsedRes.warrantToken = warrantToken;
                }
            }

            return parsedRes;
        }

        if (warrantToken != null) {
            return {warrantToken: warrantToken};
        } else {
           return resJson;
        }
    }

    private buildError(errorResponse: any): Error {
        return new ApiError(errorResponse.code, errorResponse.message);
    }
}
