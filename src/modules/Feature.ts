import {
    CreateFeatureParams,
    ListFeatureParams,
    UpdateFeatureParams,
    ListResponse,
    QueryResult,
    Warrant,
    WarrantObject,
    BaseWarrantObject,
} from "../types";
import { ObjectType } from "../types/ObjectType";
import ObjectModule from "./ObjectModule";
import WarrantModule from "./WarrantModule";
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
    public static async create(params: CreateFeatureParams = {}, options: WarrantRequestOptions = {}): Promise<Feature> {
        const response = await ObjectModule.create({
            object: {
                objectType: ObjectType.Feature,
                objectId: params.featureId,
            },
            meta: params.meta,
        }, options);

        return new Feature(response.objectId, response.meta);
    }

    public static async get(featureId: string, options: WarrantRequestOptions = {}): Promise<Feature> {
        const response = await ObjectModule.get({
            objectType: ObjectType.Feature,
            objectId: featureId,
        }, options);
        return new Feature(response.objectId, response.meta);
    }

    public static async update(featureId: string, params: UpdateFeatureParams, options: WarrantRequestOptions = {}): Promise<Feature> {
        const response = await ObjectModule.update({
            objectType: ObjectType.Feature,
            objectId: featureId,
        }, { meta: params.meta }, options);

        return new Feature(response.objectId, response.meta);
    }

    public static async delete(featureId: string, options: WarrantRequestOptions = {}): Promise<string> {
        return ObjectModule.delete({
            objectType: ObjectType.Feature,
            objectId: featureId,
        }, options);
    }

    public static async listFeatures(listParams: ListFeatureParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Feature>> {
        try {
            const response = await ObjectModule.list({
                objectType: ObjectType.Feature,
                ...listParams,
            }, options);

            const features: Feature[] = response.results.map((object: BaseWarrantObject) => new Feature(object.objectId, object.meta));
            return {
                ...response,
                results: features,
            };
        } catch (e) {
            throw e;
        }
    }

    public static async listFeaturesForPricingTier(pricingTierId: string, listParams: ListFeatureParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Feature>> {
        try {
            const queryResponse = await WarrantModule.query(`select feature where pricing-tier:${pricingTierId} is *`, listParams, options);
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

    public static async removeFeatureFromPricingTier(pricingTierId: string, featureId: string, options: WarrantRequestOptions = {}): Promise<string> {
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

    public static async listFeaturesForTenant(tenantId: string, listOptions: ListFeatureParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Feature>> {
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

    public static async removeFeatureFromTenant(tenantId: string, featureId: string, options: WarrantRequestOptions = {}): Promise<string> {
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

    public static async listFeaturesForUser(userId: string, listOptions: ListFeatureParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Feature>> {
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

    public static async removeFeatureFromUser(userId: string, featureId: string, options: WarrantRequestOptions = {}): Promise<string> {
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
