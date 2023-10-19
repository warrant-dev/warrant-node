import ListOptions from "./ListOptions";

export interface ListPricingTierOptions extends ListOptions { }

export interface CreatePricingTierParams {
    pricingTierId?: string;
    meta?: { [key: string]: any };
}
