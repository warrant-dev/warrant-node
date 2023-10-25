import ObjectModule from "./ObjectModule";
import WarrantModule from "./WarrantModule";
import { CreateFeatureParams, ListFeatureOptions } from "../types/Feature";
import { ListResponse } from "../types/List";
import { WarrantObject, WarrantObjectLiteral } from "../types/Object";
import { ObjectType } from "../types/ObjectType";
import { QueryResult } from "../types/Query";
import Warrant from "../types/Warrant";
import { WarrantRequestOptions } from "../types/WarrantRequestOptions";

export default class Feature implements WarrantObject {
    featureId: string;
    meta?: { [key: string]: any }

    constructor(featureId: string, meta: { [key: string]: any }) {
        this.featureId = featureId;
        this.meta = meta;
    }

    //
    // Static methods
    //
    public static async create(feature: CreateFeatureParams = {}, options: WarrantRequestOptions = {}): Promise<Feature> {
        try {
            const response = await ObjectModule.create({
                objectType: ObjectType.Feature,
                objectId: feature.featureId,
                meta: feature.meta,
            }, options);

            return new Feature(response.objectId, response.meta);
        } catch (e) {
            throw e;
        }
    }

    public static async get(featureId: string, options: WarrantRequestOptions = {}): Promise<Feature> {
        try {
            const response = await ObjectModule.get(ObjectType.Feature, featureId, options);

            return new Feature(response.objectId, response.meta);
        } catch (e) {
            throw e;
        }
    }

    public static async update(featureId: string, meta: { [key: string]: any }, options: WarrantRequestOptions = {}): Promise<Feature> {
        try {
            const response = await ObjectModule.update(ObjectType.Feature, featureId, meta, options);

            return new Feature(response.objectId, response.meta);
        } catch (e) {
            throw e;
        }
    }

    public static async delete(featureId: string, options: WarrantRequestOptions = {}): Promise<void> {
        return await ObjectModule.delete(ObjectType.Feature, featureId, options);
    }

    public static async listFeatures(listOptions: ListFeatureOptions = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Feature>> {
        try {
            const response = await ObjectModule.list({
                objectType: ObjectType.Feature,
                ...listOptions,
            }, options);

            const features: Feature[] = response.results.map((object: WarrantObjectLiteral) => new Feature(object.objectId, object.meta));
            return {
                ...response,
                results: features,
            };
        } catch (e) {
            throw e;
        }
    }

    public static async listFeaturesForPricingTier(pricingTierId: string, listOptions: ListFeatureOptions = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Feature>> {
        try {
            const queryResponse = await WarrantModule.query(`select feature where pricing-tier:${pricingTierId} is *`, listOptions, options);
            const features: Feature[] = queryResponse.results.map((queryResult: QueryResult) => new Feature(queryResult.objectId, queryResult.meta));
            return {
                ...queryResponse,
                results: features,
            };
        } catch (e) {
            throw e;
        }
    }

    public static async assignFeatureToPricingTier(pricingTierId: string, featureId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
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
        }, options);
    }

    public static async removeFeatureFromPricingTier(pricingTierId: string, featureId: string, options: WarrantRequestOptions = {}): Promise<void> {
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
        }, options);
    }

    public static async listFeaturesForTenant(tenantId: string, listOptions: ListFeatureOptions = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Feature>> {
        try {
            const queryResponse = await WarrantModule.query(`select feature where tenant:${tenantId} is *`, listOptions, options);
            const features: Feature[] = queryResponse.results.map((queryResult: QueryResult) => new Feature(queryResult.objectId, queryResult.meta));
            return {
                ...queryResponse,
                results: features,
            };
        } catch (e) {
            throw e;
        }
    }

    public static async assignFeatureToTenant(tenantId: string, featureId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
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
        }, options);
    }

    public static async removeFeatureFromTenant(tenantId: string, featureId: string, options: WarrantRequestOptions = {}): Promise<void> {
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
        }, options);
    }

    public static async listFeaturesForUser(userId: string, listOptions: ListFeatureOptions = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Feature>> {
        try {
            const queryResponse = await WarrantModule.query(`select feature where user:${userId} is *`, listOptions, options);
            const features: Feature[] = queryResponse.results.map((queryResult: QueryResult) => new Feature(queryResult.objectId, queryResult.meta));
            return {
                ...queryResponse,
                results: features,
            };
        } catch (e) {
            throw e;
        }
    }

    public static async assignFeatureToUser(userId: string, featureId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
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
        }, options);
    }

    public static async removeFeatureFromUser(userId: string, featureId: string, options: WarrantRequestOptions = {}): Promise<void> {
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
        }, options);
    }

    // WarrantObject methods
    public getObjectType(): string {
        return ObjectType.Feature;
    }

    public getObjectId(): string {
        return this.featureId;
    }
}
