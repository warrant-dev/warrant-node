import { ListParams } from "./List";

export interface CreateFeatureParams {
    featureId?: string;
    meta?: { [key: string]: any };
}

export interface ListFeatureParams extends ListParams {}

export interface UpdateFeatureParams {
    meta?: { [key: string]: any };
}
