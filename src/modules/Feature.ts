import WarrantModule from "./WarrantModule";
import WarrantClient from "../WarrantClient";
import { CreateFeatureParams, ListFeatureOptions } from "../types/Feature";
import Warrant, { WarrantObject } from "../types/Warrant";
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
        try {
            const response = await WarrantClient.httpClient.post({
                url: "/v1/features",
                data: feature,
            });

            return new Feature(response.featureId);
        } catch (e) {
            throw e;
        }
    }

    public static async get(featureId: string): Promise<Feature> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/features/${featureId}`,
            });

            return new Feature(response.featureId);
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
            const response = await WarrantClient.httpClient.get({
                url: "/v1/features",
                params: listOptions,
            });

            return response.map((feature: Feature) => new Feature(feature.featureId));
        } catch (e) {
            throw e;
        }
    }

    public static async listFeaturesForPricingTier(pricingTierId: string, listOptions: ListFeatureOptions = {}): Promise<Feature[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/pricing-tiers/${pricingTierId}/features`,
                params: listOptions,
            });

            return response.map((feature: Feature) => new Feature(feature.featureId));
        } catch (e) {
            throw e;
        }
    }

    public static async assignFeatureToPricingTier(pricingTierId: string, featureId: string): Promise<Warrant> {
        return WarrantModule.create({
            object: {
                objectType: ObjectType.Feature,
                objectId: featureId,
            },
            relation: "member",
            subject: {
                objectType: ObjectType.PricingTier,
                objectId: pricingTierId,
            }
        });
    }

    public static async removeFeatureFromPricingTier(pricingTierId: string, featureId: string): Promise<void> {
        return WarrantModule.delete({
            object: {
                objectType: ObjectType.Feature,
                objectId: featureId,
            },
            relation: "member",
            subject: {
                objectType: ObjectType.PricingTier,
                objectId: pricingTierId,
            }
        });
    }

    public static async listFeaturesForTenant(tenantId: string, listOptions: ListFeatureOptions = {}): Promise<Feature[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/tenants/${tenantId}/features`,
                params: listOptions,
            });

            return response.map((feature: Feature) => new Feature(feature.featureId));
        } catch (e) {
            throw e;
        }
    }

    public static async assignFeatureToTenant(tenantId: string, featureId: string): Promise<Warrant> {
        return WarrantModule.create({
            object: {
                objectType: ObjectType.Feature,
                objectId: featureId,
            },
            relation: "member",
            subject: {
                objectType: ObjectType.Tenant,
                objectId: tenantId,
            }
        });
    }

    public static async removeFeatureFromTenant(tenantId: string, featureId: string): Promise<void> {
        return WarrantModule.delete({
            object: {
                objectType: ObjectType.Feature,
                objectId: featureId,
            },
            relation: "member",
            subject: {
                objectType: ObjectType.Tenant,
                objectId: tenantId,
            }
        });
    }

    public static async listFeaturesForUser(userId: string, listOptions: ListFeatureOptions = {}): Promise<Feature[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/users/${userId}/features`,
                params: listOptions,
            });

            return response.map((feature: Feature) => new Feature(feature.featureId));
        } catch (e) {
            throw e;
        }
    }

    public static async assignFeatureToUser(userId: string, featureId: string): Promise<Warrant> {
        return WarrantModule.create({
            object: {
                objectType: ObjectType.Feature,
                objectId: featureId,
            },
            relation: "member",
            subject: {
                objectType: ObjectType.User,
                objectId: userId,
            }
        });
    }

    public static async removeFeatureFromUser(userId: string, featureId: string): Promise<void> {
        return WarrantModule.delete({
            object: {
                objectType: ObjectType.Feature,
                objectId: featureId,
            },
            relation: "member",
            subject: {
                objectType: ObjectType.User,
                objectId: userId,
            }
        });
    }

    // WarrantObject methods
    public getObjectType(): string {
        return ObjectType.Feature;
    }

    public getObjectId(): string {
        return this.featureId;
    }
}
