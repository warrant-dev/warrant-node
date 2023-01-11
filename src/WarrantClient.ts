import { API_URL_BASE } from "./constants";
import ApiClient from "./HttpClient";
import Config from "./types/Config";

export default class WarrantClient {
    static config: Config;
    static httpClient: ApiClient;

    constructor(config: Config) {
        WarrantClient.config = config;
        WarrantClient.httpClient = new ApiClient({
            apiKey: config.apiKey,
            baseUrl: config.endpoint || API_URL_BASE,
        });
    }
}
