import Authorization from "./Authorization";
import Feature, { ListFeaturesResult } from "./Feature";
import ObjectModule from "./ObjectModule";
import WarrantModule from "./WarrantModule";
import { ListFeatureOptions } from "../types/Feature";
import { WarrantObject, WarrantObjectLiteral } from "../types/Object";
import { ObjectType } from "../types/ObjectType";
import { CreatePricingTierParams, ListPricingTierOptions } from "../types/PricingTier";
import { QueryResult } from "../types/Query";
import Warrant, { PolicyContext } from "../types/Warrant";
import { WarrantRequestOptions } from "../types/WarrantRequestOptions";

export interface ListPricingTiersResult {
    results: PricingTier[];
    prevCursor?: string;
    nextCursor?: string;
}

export default class PricingTier implements WarrantObject {
    pricingTierId: string;
    meta?: { [key: string]: any }

    constructor(pricingTierId: string, meta: { [key: string]: any }) {
        this.pricingTierId = pricingTierId;
        this.meta = meta;
    }

    //
    // Static methods
    //
    public static async create(pricingTier: CreatePricingTierParams = {}, options: WarrantRequestOptions = {}): Promise<PricingTier> {
        try {
            const response = await ObjectModule.create({
                objectType: ObjectType.PricingTier,
                objectId: pricingTier.pricingTierId,
                meta: pricingTier.meta,
            }, options);

            return new PricingTier(response.objectId, response.meta);
        } catch (e) {
            throw e;
        }
    }

    public static async get(pricingTierId: string, options: WarrantRequestOptions = {}): Promise<PricingTier> {
        try {
            const response = await ObjectModule.get(ObjectType.PricingTier, pricingTierId, options);

            return new PricingTier(response.objectId, response.meta);
        } catch (e) {
            throw e;
        }
    }

    public static async update(pricingTierId: string, meta: { [key: string]: any }, options: WarrantRequestOptions = {}): Promise<PricingTier> {
        try {
            const response = await ObjectModule.update(ObjectType.PricingTier, pricingTierId, meta, options);

            return new PricingTier(response.objectId, response.meta);
        } catch (e) {
            throw e;
        }
    }

    public static async delete(pricingTierId: string, options: WarrantRequestOptions = {}): Promise<void> {
        return await ObjectModule.delete(ObjectType.PricingTier, pricingTierId, options);
    }

    public static async listPricingTiers(listOptions: ListPricingTierOptions = {}, options: WarrantRequestOptions = {}): Promise<ListPricingTiersResult> {
        try {
            const response = await ObjectModule.list({
                objectType: ObjectType.PricingTier,
                ...listOptions,
            }, options);

            const pricingTiers: PricingTier[] = response.results.map((object: WarrantObjectLiteral) => new PricingTier(object.objectId, object.meta));
            return {
                ...response,
                results: pricingTiers,
            };
        } catch (e) {
            throw e;
        }
    }

    public static async listPricingTiersForTenant(tenantId: string, listOptions: ListPricingTierOptions = {}, options: WarrantRequestOptions = {}): Promise<ListPricingTiersResult> {
        try {
            const queryResponse = await WarrantModule.query(`select pricing-tier where tenant:${tenantId} is *`, listOptions)
            const pricingTiers: PricingTier[] = queryResponse.results.map((queryResult: QueryResult) => new PricingTier(queryResult.objectId, queryResult.meta));
            return {
                ...queryResponse,
                results: pricingTiers,
            };
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

    public static async listPricingTiersForUser(userId: string, listOptions: ListPricingTierOptions = {}, options: WarrantRequestOptions = {}): Promise<ListPricingTiersResult> {
        try {
            const queryResponse = await WarrantModule.query(`select pricing-tier where user:${userId} is *`, listOptions)
            const pricingTiers: PricingTier[] = queryResponse.results.map((queryResult: QueryResult) => new PricingTier(queryResult.objectId, queryResult.meta));
            return {
                ...queryResponse,
                results: pricingTiers,
            };
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
    public async listFeatures(listOptions: ListFeatureOptions = {}, options: WarrantRequestOptions = {}): Promise<ListFeaturesResult> {
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
