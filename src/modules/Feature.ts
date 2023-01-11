import WarrantClient from "../WarrantClient";
import { CreateFeatureParams, ListFeatureOptions } from "../types/Feature";
import { WarrantObject } from "../types/Warrant";
import { ObjectType } from "../types/ObjectType";

export default class Feature implements WarrantObject {
    featureId: string;

    constructor(featureId: string) {
        this.featureId = featureId;
    }

    //
    // Static methods
    //
    public static async create(feature: CreateFeatureParams): Promise<Feature> {
        return WarrantClient.httpClient
            .post({
                url: "/v1/features",
                data: feature,
            })
            .then((res) => new Feature(res.featureId))
            .catch((e) => {
                throw e;
            });
    }

    public static async get(featureId: string): Promise<Feature> {
        return WarrantClient.httpClient
            .get({
                url: `/v1/features/${featureId}`,
            })
            .then((res) => new Feature(res.featureId))
            .catch((e) => {
                throw e;
            });
    }

    public static async delete(featureId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/features/${featureId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async listFeatures(listOptions: ListFeatureOptions = {}): Promise<Feature[]> {
        return WarrantClient.httpClient
            .get({
                url: "/v1/features",
                params: listOptions,
            })
            .then((res) => res.map((feature: Feature) => new Feature(feature.featureId)))
            .catch((e) => {
                throw e;
            });
    }

    public static async listFeaturesForPricingTier(pricingTierId: string, listOptions: ListFeatureOptions = {}): Promise<Feature[]> {
        return WarrantClient.httpClient
            .get({
                url: `/v1/pricing-tiers/${pricingTierId}/features`,
                params: listOptions,
            })
            .then((res) => res.map((feature: Feature) => new Feature(feature.featureId)))
            .catch((e) => {
                throw e;
            });
    }

    public static async assignFeatureToPricingTier(pricingTierId: string, featureId: string): Promise<Feature> {
        return WarrantClient.httpClient
            .post({
                url: `/v1/pricing-tiers/${pricingTierId}/features/${featureId}`,
            })
            .then((res) => new Feature(res.featureId))
            .catch((e) => {
                throw e;
            });
    }

    public static async removeFeatureFromPricingTier(pricingTierId: string, featureId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/pricing-tiers/${pricingTierId}/features/${featureId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async listFeaturesForTenant(tenantId: string, listOptions: ListFeatureOptions = {}): Promise<Feature[]> {
        return WarrantClient.httpClient
            .get({
                url: `/v1/tenants/${tenantId}/features`,
                params: listOptions,
            })
            .then((res) => res.map((feature: Feature) => new Feature(feature.featureId)))
            .catch((e) => {
                throw e;
            });
    }

    public static async assignFeatureToTenant(tenantId: string, featureId: string): Promise<Feature> {
        return WarrantClient.httpClient
            .post({
                url: `/v1/tenants/${tenantId}/features/${featureId}`,
            })
            .then((res) => new Feature(res.featureId))
            .catch((e) => {
                throw e;
            });
    }

    public static async removeFeatureFromTenant(tenantId: string, featureId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/tenants/${tenantId}/features/${featureId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async listFeaturesForUser(userId: string, listOptions: ListFeatureOptions = {}): Promise<Feature[]> {
        return WarrantClient.httpClient
            .get({
                url: `/v1/users/${userId}/features`,
                params: listOptions,
            })
            .then((res) => res.map((feature: Feature) => new Feature(feature.featureId)))
            .catch((e) => {
                throw e;
            });
    }

    public static async assignFeatureToUser(userId: string, featureId: string): Promise<Feature> {
        return WarrantClient.httpClient
            .post({
                url: `/v1/users/${userId}/features/${featureId}`,
            })
            .then((res) => new Feature(res.featureId))
            .catch((e) => {
                throw e;
            });
    }

    public static async removeFeatureFromUser(userId: string, featureId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/users/${userId}/features/${featureId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    // WarrantObject methods
    public getObjectType(): string {
        return ObjectType.Feature;
    }

    public getObjectId(): string {
        return this.featureId;
    }
}
