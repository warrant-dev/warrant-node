import { API_URL_BASE } from "./constants";
import ApiClient from "./HttpClient";
import Authorization from "./modules/Authorization";
import Feature from "./modules/Feature";
import Permission from "./modules/Permission";
import PricingTier from "./modules/PricingTier";
import Role from "./modules/Role";
import Session from "./modules/Session";
import Tenant from "./modules/Tenant";
import User from "./modules/User";
import Warrant from "./modules/WarrantModule";
import Config from "./types/Config";

export default class WarrantClient {
    static config: Config;
    static httpClient: ApiClient;

    public Authorization: typeof Authorization;
    public Feature: typeof Feature;
    public Permission: typeof Permission;
    public PricingTier: typeof PricingTier;
    public Role: typeof Role;
    public Session: typeof Session;
    public Tenant: typeof Tenant;
    public User: typeof User;
    public Warrant: typeof Warrant;

    constructor(config: Config) {
        WarrantClient.config = config;
        WarrantClient.httpClient = new ApiClient({
            apiKey: config.apiKey,
            baseUrl: config.endpoint || API_URL_BASE,
        });
    }
}
