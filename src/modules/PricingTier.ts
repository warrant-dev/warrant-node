import Authorization from "./Authorization";
import Feature from "./Feature";
import WarrantModule from "./WarrantModule";
import WarrantClient from "../WarrantClient";
import { ListFeatureOptions } from "../types/Feature";
import { ObjectType } from "../types/ObjectType";
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
    public static async create(pricingTier: CreatePricingTierParams): Promise<PricingTier> {
        try {
            const response = await WarrantClient.httpClient.post({
                url: "/v1/pricing-tiers",
                data: pricingTier,
            });

            return new PricingTier(response.pricingTierId);
        } catch (e) {
            throw e;
        }
    }

    public static async get(pricingTierId: string): Promise<PricingTier> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/pricing-tiers/${pricingTierId}`,
            });

            return new PricingTier(response.pricingTierId);
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
            const response = await WarrantClient.httpClient.get({
                url: "/v1/pricing-tiers",
                params: listOptions,
            });

            return response.map((pricingTier: PricingTier) => new PricingTier(pricingTier.pricingTierId));
        } catch (e) {
            throw e;
        }
    }

    public static async listPricingTiersForTenant(tenantId: string, listOptions: ListPricingTierOptions = {}): Promise<PricingTier[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/tenants/${tenantId}/pricing-tiers`,
                params: listOptions,
            });

            return response.map((pricingTier: PricingTier) => new PricingTier(pricingTier.pricingTierId));
        } catch (e) {
            throw e;
        }
    }

    public static async assignPricingTierToTenant(tenantId: string, pricingTierId: string): Promise<Warrant> {
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
        });
    }

    public static async removePricingTierFromTenant(tenantId: string, pricingTierId: string): Promise<void> {
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
        });
    }

    public static async listPricingTiersForUser(userId: string, listOptions: ListPricingTierOptions = {}): Promise<PricingTier[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/users/${userId}/pricing-tiers`,
                params: listOptions,
            });

            return response.map((pricingTier: PricingTier) => new PricingTier(pricingTier.pricingTierId));
        } catch (e) {
            throw e;
        }
    }

    public static async assignPricingTierToUser(userId: string, pricingTierId: string): Promise<Warrant> {
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
        });
    }

    public static async removePricingTierFromUser(userId: string, pricingTierId: string): Promise<void> {
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
        });
    }

    // Instance methods
    public async listFeatures(listOptions: ListFeatureOptions = {}): Promise<Feature[]> {
        return Feature.listFeaturesForPricingTier(this.pricingTierId, listOptions);
    }

    public async assignFeature(featureId: string): Promise<Warrant> {
        return Feature.assignFeatureToPricingTier(this.pricingTierId, featureId);
    }

    public async removeFeature(featureId: string): Promise<void> {
        return Feature.removeFeatureFromPricingTier(this.pricingTierId, featureId);
    }

    public async hasFeature(featureId: string, context: PolicyContext = {}): Promise<boolean> {
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
