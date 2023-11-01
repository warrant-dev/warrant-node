import { ListParams } from "./List";

export interface ListPricingTierParams extends ListParams { }

export interface CreatePricingTierParams {
    pricingTierId?: string;
    meta?: { [key: string]: any };
}

export interface ListPricingTierParams extends ListParams {}

export interface UpdatePricingTierParams {
    meta?: { [key: string]: any };
}
