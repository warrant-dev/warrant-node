import Config from "./types/Config";
import Authorization from "./modules/Authorization";
import Feature from "./modules/Feature";
import PricingTier from "./modules/PricingTier";

declare module 'warrant' {
    export class WarrantClient {
        static WarrantClient: typeof WarrantClient;

        constructor(config: Config);

        Authorization: typeof Authorization;
        Feature: typeof Feature;
        PricingTier: typeof PricingTier;
    }

    export default WarrantClient;
}
