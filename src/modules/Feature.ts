import WarrantClient from "../WarrantClient";
import { CreateFeatureParams, ListFeatureOptions } from "../types/Feature";
import { ObjectType } from "../types/ObjectType";
import { WarrantObject } from "../types/Warrant";

export default class Feature implements WarrantObject {
    // WarrantObject properties
    objectType: string = ObjectType.Feature;
    objectId: string;

    // Feature properties
    featureId: string;

    constructor(featureId: string) {
        this.objectId = featureId;
        this.featureId = featureId;
    }

    //
    // Static methods
    //
    public static async create(feature: CreateFeatureParams): Promise<Feature> {
        try {
            return await WarrantClient.httpClient.post({
                url: "/v1/features",
                data: feature,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async get(featureId: string): Promise<Feature> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/features/${featureId}`,
            });
        } catch (e) {
            throw e;
        }
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
        try {
            return await WarrantClient.httpClient.get({
                url: "/v1/features",
                params: listOptions,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async listFeaturesForPricingTier(pricingTierId: string, listOptions: ListFeatureOptions = {}): Promise<Feature[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/pricing-tiers/${pricingTierId}/features`,
                params: listOptions,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async assignFeatureToPricingTier(pricingTierId: string, featureId: string): Promise<Feature> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/pricing-tiers/${pricingTierId}/features/${featureId}`,
            });
        } catch (e) {
            throw e;
        }
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
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/tenants/${tenantId}/features`,
                params: listOptions,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async assignFeatureToTenant(tenantId: string, featureId: string): Promise<Feature> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/tenants/${tenantId}/features/${featureId}`,
            });
        } catch (e) {
            throw e;
        }
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
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/users/${userId}/features`,
                params: listOptions,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async assignFeatureToUser(userId: string, featureId: string): Promise<Feature> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/users/${userId}/features/${featureId}`,
            });
        } catch (e) {
            throw e;
        }
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
}
