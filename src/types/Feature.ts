import { ListParams } from "./List";

export interface CreateFeatureParams {
    featureId?: string;
    meta?: { [key: string]: any };
}

export interface GetFeatureParams {
    featureId: string;
}

export interface ListFeatureParams extends ListParams {}

export interface UpdateFeatureParams {
    featureId: string;
    meta: { [key: string]: any };
}

export interface DeleteFeatureParams {
    featureId: string;
}
