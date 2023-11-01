import { ListParams } from "./List";

export interface ListPricingTierParams extends ListParams { }

export interface CreatePricingTierParams {
    pricingTierId?: string;
    meta?: { [key: string]: any };
}

export interface GetPricingTierParams {
    pricingTierId: string;
}

export interface ListPricingTierParams extends ListParams {}

export interface UpdatePricingTierParams {
    pricingTierId: string;
    meta: { [key: string]: any };
}

export interface DeletePricingTierParams {
    pricingTierId: string;
}
