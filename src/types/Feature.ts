import ListOptions from "./List";

export interface ListFeatureOptions extends ListOptions {}

export interface CreateFeatureParams {
    featureId?: string;
    meta?: { [key: string]: any };
}
