import Config from "./types/Config";
import Authorization from "./modules/Authorization";
import Feature from "./modules/Feature";
import Permission from "./modules/Permission";
import PricingTier from "./modules/PricingTier";
import Role from "./modules/Role";
import Tenant from "./modules/Tenant";
import User from "./modules/User";

declare module 'warrant' {
    export class WarrantClient {
        static WarrantClient: typeof WarrantClient;

        constructor(config: Config);

        Authorization: typeof Authorization;
        Feature: typeof Feature;
        Permission: typeof Permission;
        PricingTier: typeof PricingTier;
        Role: typeof Role;
        Tenant: typeof Tenant;
        User: typeof User;
    }

    export default WarrantClient;
}
