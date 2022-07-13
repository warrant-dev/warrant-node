import Axios, { AxiosRequestConfig } from "axios";
import ApiError from "./types/ApiError";

interface HttpClient {
    get(url: string, config: HttpClientRequestConfig): Promise<any>;
    delete(url: string, config: HttpClientRequestConfig): Promise<any>;
    post(url: string, data: any, config: HttpClientRequestConfig): Promise<any>;
}

export interface HttpClientConfig {
    apiKey: string;
    baseUrl: string;
}

export interface HttpClientRequestConfig {
    apiKey?: string;
    baseUrl?: string;
    params?: any;
}

export default class ApiClient implements HttpClient {
    private config: HttpClientConfig;

    constructor(config: HttpClientConfig) {
        this.config = config;
    }

    public async get(url: string, config?: HttpClientRequestConfig): Promise<any> {
        try {
            const response = await Axios({
                method: "GET",
                url,
                ...this.buildRequestConfig(config),
            });
            return response.data;
        } catch (e) {
            throw new ApiError(e.response.data.code, e.response.data.message);
        }
    }

    public async delete(url: string, data?: any, config?: HttpClientRequestConfig): Promise<any> {
        try {
            const response = await Axios({
                method: "DELETE",
                url,
                data,
                ...this.buildRequestConfig(config),
            });
            return response.data;
        } catch (e) {
            throw new ApiError(e.response.data.code, e.response.data.message);
        }
    }

    public async post(url: string, data?: any, config?: HttpClientRequestConfig): Promise<any> {
        try {
            const response = await Axios({
                method: "POST",
                url,
                data,
                ...this.buildRequestConfig(config),
            });
            return response.data;
        } catch (e) {
            throw new ApiError(e.response.data.code, e.response.data.message);
        }
    }

    private buildRequestConfig(requestConfig?: HttpClientRequestConfig): AxiosRequestConfig {
        const config: AxiosRequestConfig = {
            baseURL: this.config.baseUrl,
            headers: {
                Authorization: `ApiKey ${this.config.apiKey}`,
            },
            ...requestConfig,
        };

        if (requestConfig?.apiKey) {
            config.headers = {
                Authorization: `ApiKey ${requestConfig.apiKey}`,
            };
        }

        if (requestConfig?.baseUrl) {
            config.baseURL = requestConfig.baseUrl;
        }

        return config;
    }
}
