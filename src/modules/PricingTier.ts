import Authorization from "./Authorization";
import Feature from "./Feature";
import WarrantModule from "./WarrantModule";
import WarrantClient from "../WarrantClient";
import { API_VERSION } from "../constants";
import { ListFeatureOptions } from "../types/Feature";
import { ObjectType } from "../types/ObjectType";
import { WarrantRequestOptions } from "../types/WarrantRequestOptions";
import { CreatePricingTierParams, ListPricingTierOptions } from "../types/PricingTier";
import Warrant, { PolicyContext, WarrantObject } from "../types/Warrant";

export default class PricingTier implements WarrantObject {
    pricingTierId: string;

    constructor(pricingTierId: string) {
        this.pricingTierId = pricingTierId;
    }

    //
    // Static methods
    //
    public static async create(pricingTier: CreatePricingTierParams, options: WarrantRequestOptions = {}): Promise<PricingTier> {
        try {
            const response = await WarrantClient.httpClient.post({
                url: `/${API_VERSION}/pricing-tiers`,
                data: pricingTier,
                options,
            });

            return new PricingTier(response.pricingTierId);
        } catch (e) {
            throw e;
        }
    }

    public static async get(pricingTierId: string, options: WarrantRequestOptions = {}): Promise<PricingTier> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/${API_VERSION}/pricing-tiers/${pricingTierId}`,
                options,
            });

            return new PricingTier(response.pricingTierId);
        } catch (e) {
            throw e;
        }
    }

    public static async delete(pricingTierId: string, options: WarrantRequestOptions = {}): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/${API_VERSION}/pricing-tiers/${pricingTierId}`,
                options,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async listPricingTiers(listOptions: ListPricingTierOptions = {}, options: WarrantRequestOptions = {}): Promise<PricingTier[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/${API_VERSION}/pricing-tiers`,
                params: listOptions,
                options,
            });

            return response.map((pricingTier: PricingTier) => new PricingTier(pricingTier.pricingTierId));
        } catch (e) {
            throw e;
        }
    }

    public static async listPricingTiersForTenant(tenantId: string, listOptions: ListPricingTierOptions = {}, options: WarrantRequestOptions = {}): Promise<PricingTier[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/${API_VERSION}/tenants/${tenantId}/pricing-tiers`,
                params: listOptions,
                options,
            });

            return response.map((pricingTier: PricingTier) => new PricingTier(pricingTier.pricingTierId));
        } catch (e) {
            throw e;
        }
    }

    public static async assignPricingTierToTenant(tenantId: string, pricingTierId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return WarrantModule.create({
            object: {
                objectType: ObjectType.PricingTier,
                objectId: pricingTierId,
            },
            relation: "member",
            subject: {
                objectType: ObjectType.Tenant,
                objectId: tenantId,
            }
        }, options);
    }

    public static async removePricingTierFromTenant(tenantId: string, pricingTierId: string, options: WarrantRequestOptions = {}): Promise<void> {
        return WarrantModule.delete({
            object: {
                objectType: ObjectType.PricingTier,
                objectId: pricingTierId,
            },
            relation: "member",
            subject: {
                objectType: ObjectType.Tenant,
                objectId: tenantId,
            }
        }, options);
    }

    public static async listPricingTiersForUser(userId: string, listOptions: ListPricingTierOptions = {}, options: WarrantRequestOptions = {}): Promise<PricingTier[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/${API_VERSION}/users/${userId}/pricing-tiers`,
                params: listOptions,
                options,
            });

            return response.map((pricingTier: PricingTier) => new PricingTier(pricingTier.pricingTierId));
        } catch (e) {
            throw e;
        }
    }

    public static async assignPricingTierToUser(userId: string, pricingTierId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return WarrantModule.create({
            object: {
                objectType: ObjectType.PricingTier,
                objectId: pricingTierId,
            },
            relation: "member",
            subject: {
                objectType: ObjectType.User,
                objectId: userId,
            }
        }, options);
    }

    public static async removePricingTierFromUser(userId: string, pricingTierId: string, options: WarrantRequestOptions = {}): Promise<void> {
        return WarrantModule.delete({
            object: {
                objectType: ObjectType.PricingTier,
                objectId: pricingTierId,
            },
            relation: "member",
            subject: {
                objectType: ObjectType.User,
                objectId: userId,
            }
        }, options);
    }

    // Instance methods
    public async listFeatures(listOptions: ListFeatureOptions = {}, options: WarrantRequestOptions = {}): Promise<Feature[]> {
        return Feature.listFeaturesForPricingTier(this.pricingTierId, listOptions, options);
    }

    public async assignFeature(featureId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return Feature.assignFeatureToPricingTier(this.pricingTierId, featureId, options);
    }

    public async removeFeature(featureId: string, options: WarrantRequestOptions = {}): Promise<void> {
        return Feature.removeFeatureFromPricingTier(this.pricingTierId, featureId, options);
    }

    public async hasFeature(featureId: string, context: PolicyContext = {}, options: WarrantRequestOptions = {}): Promise<boolean> {
        return Authorization.hasFeature({ featureId: featureId, subject: { objectType: ObjectType.PricingTier, objectId: this.pricingTierId }, context: context }, options);
    }

    // WarrantObject methods
    public getObjectType(): string {
        return ObjectType.PricingTier;
    }

    public getObjectId(): string {
        return this.pricingTierId;
    }
}
