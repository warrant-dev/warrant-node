import {
    CreatePricingTierParams,
    ListPricingTierParams,
    ListFeatureParams,
    ListResponse,
    UpdatePricingTierParams,
    QueryResult,
    Warrant,
    FeatureCheckParams,
    WarrantObject,
    BaseWarrantObject,
} from "../types";
import Authorization from "./Authorization";
import Feature from "./Feature";
import ObjectModule from "./ObjectModule";
import WarrantModule from "./WarrantModule";
import { ObjectType } from "../types/ObjectType";
import { WarrantRequestOptions } from "../types/WarrantRequestOptions";


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
        const response = await ObjectModule.create({
            object: {
                objectType: ObjectType.PricingTier,
                objectId: pricingTier.pricingTierId,
            },
            meta: pricingTier.meta,
        }, options);

        return new PricingTier(response.objectId, response.meta);
    }

    public static async get(pricingTierId: string, options: WarrantRequestOptions = {}): Promise<PricingTier> {
        const response = await ObjectModule.get({
            objectType: ObjectType.PricingTier,
            objectId: pricingTierId,
        }, options);

        return new PricingTier(response.objectId, response.meta);
    }

    public static async update(pricingTierId: string, params: UpdatePricingTierParams, options: WarrantRequestOptions = {}): Promise<PricingTier> {
        const response = await ObjectModule.update({
            objectType: ObjectType.PricingTier,
            objectId: pricingTierId,
        }, { meta: params.meta }, options);

        return new PricingTier(response.objectId, response.meta);
    }

    public static async delete(pricingTierId: string, options: WarrantRequestOptions = {}): Promise<string> {
        return ObjectModule.delete({
            objectType: ObjectType.PricingTier,
            objectId: pricingTierId,
        }, options);
    }

    public static async listPricingTiers(listParams: ListPricingTierParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<PricingTier>> {
        try {
            const response = await ObjectModule.list({
                objectType: ObjectType.PricingTier,
                ...listParams,
            }, options);

            const pricingTiers: PricingTier[] = response.results.map((object: BaseWarrantObject) => new PricingTier(object.objectId, object.meta));
            return {
                ...response,
                results: pricingTiers,
            };
        } catch (e) {
            throw e;
        }
    }

    public static async listPricingTiersForTenant(tenantId: string, listParams: ListPricingTierParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<PricingTier>> {
        try {
            const queryResponse = await WarrantModule.query(`select pricing-tier where tenant:${tenantId} is *`, listParams, options);
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

    public static async removePricingTierFromTenant(tenantId: string, pricingTierId: string, options: WarrantRequestOptions = {}): Promise<string> {
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

    public static async listPricingTiersForUser(userId: string, listParams: ListPricingTierParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<PricingTier>> {
        try {
            const queryResponse = await WarrantModule.query(`select pricing-tier where user:${userId} is *`, listParams, options);
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

    public static async removePricingTierFromUser(userId: string, pricingTierId: string, options: WarrantRequestOptions = {}): Promise<string> {
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
    public async listFeatures(listParams: ListFeatureParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Feature>> {
        return Feature.listFeaturesForPricingTier(this.pricingTierId, listParams, options);
    }

    public async assignFeature(featureId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return Feature.assignFeatureToPricingTier(this.pricingTierId, featureId, options);
    }

    public async removeFeature(featureId: string, options: WarrantRequestOptions = {}): Promise<string> {
        return Feature.removeFeatureFromPricingTier(this.pricingTierId, featureId, options);
    }

    public async hasFeature(params: FeatureCheckParams, options: WarrantRequestOptions = {}): Promise<boolean> {
        return Authorization.hasFeature({ featureId: params.featureId, subject: { objectType: ObjectType.PricingTier, objectId: this.pricingTierId }, context: params.context }, options);
    }

    // WarrantObject methods
    public getObjectType(): string {
        return ObjectType.PricingTier;
    }

    public getObjectId(): string {
        return this.pricingTierId;
    }
}
