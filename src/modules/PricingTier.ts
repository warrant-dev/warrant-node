import Authorization from "./Authorization";
import Feature from "./Feature";
import WarrantClient from "../WarrantClient";
import { ListFeatureOptions } from "../types/Feature";
import { ObjectType } from "../types/ObjectType";
import { CreatePricingTierParams, ListPricingTierOptions } from "../types/PricingTier";
import { Context, WarrantObject } from "../types/Warrant";

export default class PricingTier implements WarrantObject {
    pricingTierId: string;

    constructor(pricingTierId: string) {
        this.pricingTierId = pricingTierId;
    }

    //
    // Static methods
    //
    public static async create(pricingTier: CreatePricingTierParams): Promise<PricingTier> {
        try {
            return await WarrantClient.httpClient.post({
                url: "/v1/pricing-tiers",
                data: pricingTier,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async get(pricingTierId: string): Promise<PricingTier> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/pricing-tiers/${pricingTierId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async delete(pricingTierId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/pricing-tiers/${pricingTierId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async listPricingTiers(listOptions: ListPricingTierOptions = {}): Promise<PricingTier[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: "/v1/pricing-tiers",
                params: listOptions,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async listPricingTiersForTenant(tenantId: string, listOptions: ListPricingTierOptions = {}): Promise<PricingTier[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/tenants/${tenantId}/pricing-tiers`,
                params: listOptions,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async assignPricingTierToTenant(tenantId: string, pricingTierId: string): Promise<PricingTier> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/tenants/${tenantId}/pricing-tiers/${pricingTierId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async removePricingTierFromTenant(tenantId: string, pricingTierId: string): Promise<void> {
        try {
            await WarrantClient.httpClient.delete({
                url: `/v1/tenants/${tenantId}/pricing-tiers/${pricingTierId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async listPricingTiersForUser(userId: string, listOptions: ListPricingTierOptions = {}): Promise<PricingTier[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/users/${userId}/pricing-tiers`,
                params: listOptions,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async assignPricingTierToUser(userId: string, pricingTierId: string): Promise<PricingTier> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/users/${userId}/pricing-tiers/${pricingTierId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async removePricingTierFromUser(userId: string, pricingTierId: string): Promise<void> {
        try {
            await WarrantClient.httpClient.delete({
                url: `/v1/users/${userId}/pricing-tiers/${pricingTierId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    // Instance methods
    public async listFeatures(listOptions: ListFeatureOptions = {}): Promise<Feature[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/pricing-tiers/${this.pricingTierId}/features`,
                params: listOptions,
            });
        } catch (e) {
            throw e;
        }
    }

    public async assignFeature(featureId: string): Promise<Feature> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/pricing-tiers/${this.pricingTierId}/features/${featureId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public async removeFeature(featureId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/pricing-tiers/${this.pricingTierId}/features/${featureId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public async hasFeature(featureId: string, context: Context = {}): Promise<boolean> {
        return Authorization.hasFeature({ featureId: featureId, subject: { objectType: ObjectType.PricingTier, objectId: this.pricingTierId }, context: context });
    }

    // WarrantObject methods
    public getObjectType(): string {
        return ObjectType.PricingTier;
    }

    public getObjectId(): string {
        return this.pricingTierId;
    }
}
