import Config from "./types/Config";
import Authorization from "./modules/Authorization";
import Feature from "./modules/Feature";
import Permission from "./modules/Permission";
import PricingTier from "./modules/PricingTier";
import Role from "./modules/Role";
import Session from "./modules/Session";
import Tenant from "./modules/Tenant";
import User from "./modules/User";
import Warrant from "./modules/WarrantModule";

declare module 'warrant' {
    export class WarrantClient {
        static WarrantClient: typeof WarrantClient;

        constructor(config: Config);

        Authorization: typeof Authorization;
        Feature: typeof Feature;
        Permission: typeof Permission;
        PricingTier: typeof PricingTier;
        Role: typeof Role;
        Session: typeof Session;
        Tenant: typeof Tenant;
        User: typeof User;
        Warrant: typeof Warrant;
    }

    export default WarrantClient;
}
