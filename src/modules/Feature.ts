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
            console.log("Error creating feature");
            throw e;
        }
    }

    public static async get(featureId: string): Promise<Feature> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/features/${featureId}`,
            });
        } catch (e) {
            console.log("Error getting feature");
            throw e;
        }
    }

    public static async delete(featureId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/features/${featureId}`,
            });
        } catch (e) {
            console.log("Error deleting feature");
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
            console.log("Error listing features");
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
            console.log("Error listing features for pricing tier");
            throw e;
        }
    }

    public static async addFeatureToPricingTier(pricingTierId: string, featureId: string): Promise<Feature> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/pricing-tiers/${pricingTierId}/features/${featureId}`,
            });
        } catch (e) {
            console.log("Error adding feature to pricing tier");
            throw e;
        }
    }

    public static async removeFeatureFromPricingTier(pricingTierId: string, featureId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/pricing-tiers/${pricingTierId}/features/${featureId}`,
            });
        } catch (e) {
            console.log("Error removing feature from pricing tier");
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
            console.log("Error listing features for tenant");
            throw e;
        }
    }

    public static async addFeatureToTenant(tenantId: string, featureId: string): Promise<Feature> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/tenants/${tenantId}/features/${featureId}`,
            });
        } catch (e) {
            console.log("Error adding feature to tenant");
            throw e;
        }
    }

    public static async removeFeatureFromTenant(tenantId: string, featureId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/tenants/${tenantId}/features/${featureId}`,
            });
        } catch (e) {
            console.log("Error removing feature from tenant");
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
            console.log("Error listing features for user");
            throw e;
        }
    }

    public static async addFeatureToUser(userId: string, featureId: string): Promise<Feature> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/users/${userId}/features/${featureId}`,
            });
        } catch (e) {
            console.log("Error adding feature to user");
            throw e;
        }
    }

    public static async removeFeatureFromUser(userId: string, featureId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/users/${userId}/features/${featureId}`,
            });
        } catch (e) {
            console.log("Error removing feature from user");
            throw e;
        }
    }
}
