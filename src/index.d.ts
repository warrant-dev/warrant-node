import Config from "./types/Config";
import Authorization from "./modules/Authorization";
import Feature from "./modules/Feature";
import Permission from "./modules/Permission";
import PricingTier from "./modules/PricingTier";
import Role from "./modules/Role";

declare module 'warrant' {
    export class WarrantClient {
        static WarrantClient: typeof WarrantClient;

        constructor(config: Config);

        Authorization: typeof Authorization;
        Feature: typeof Feature;
        Permission: typeof Permission;
        PricingTier: typeof PricingTier;
        Role: typeof Role;
    }

    export default WarrantClient;
}
