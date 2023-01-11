import { API_URL_BASE } from "./constants";
import ApiClient from "./HttpClient";
import Authorization from "./modules/Authorization";
import Feature from "./modules/Feature";
import PricingTier from "./modules/PricingTier";
import Config from "./types/Config";

export default class WarrantClient {
    static config: Config;
    static httpClient: ApiClient;

    public Authorization: typeof Authorization;
    public Feature: typeof Feature;
    public PricingTier: typeof PricingTier;

    constructor(config: Config) {
        WarrantClient.config = config;
        WarrantClient.httpClient = new ApiClient({
            apiKey: config.apiKey,
            baseUrl: config.endpoint || API_URL_BASE,
        });
    }
}
