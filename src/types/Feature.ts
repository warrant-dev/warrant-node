import ListOptions from "./ListOptions";

export interface ListFeatureOptions extends ListOptions {}

export interface CreateFeatureParams {
    featureId?: string;
    meta?: { [key: string]: any };
}
