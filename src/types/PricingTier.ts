import ListOptions from "./List";

export interface ListPricingTierOptions extends ListOptions { }

export interface CreatePricingTierParams {
    pricingTierId?: string;
    meta?: { [key: string]: any };
}
