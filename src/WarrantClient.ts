import { API_URL_BASE } from "./constants";
import ApiClient from "./HttpClient";
import Authorization from "./modules/Authorization";
import Feature from "./modules/Feature";
import Object from "./modules/ObjectModule";
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

    public Authorization: typeof Authorization = Authorization;
    public Feature: typeof Feature = Feature;
    public Object: typeof Object = Object;
    public Permission: typeof Permission = Permission;
    public PricingTier: typeof PricingTier = PricingTier;
    public Role: typeof Role = Role;
    public Session: typeof Session = Session;
    public Tenant: typeof Tenant = Tenant;
    public User: typeof User = User;
    public Warrant: typeof Warrant = Warrant;

    constructor(config: Config) {
        WarrantClient.config = config;
        WarrantClient.httpClient = new ApiClient({
            apiKey: config.apiKey,
            baseUrl: config.endpoint || API_URL_BASE,
        });
    }
}
