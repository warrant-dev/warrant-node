import {
    ListFeatureParams,
    ListResponse,
    WarrantObject,
    BaseWarrantObject,
    ListPricingTierParams,
    QueryResult,
    CreateTenantParams,
    DeleteTenantParams,
    GetTenantParams,
    ListTenantParams,
    UpdateTenantParams,
    ListUserParams,
    Warrant,
    FeatureCheckParams,
} from "../types";
import Authorization from "./Authorization";
import Feature from "./Feature";
import ObjectModule from "./ObjectModule";
import PricingTier from "./PricingTier";
import User from "./User";
import WarrantModule from "./WarrantModule";
import { ObjectType } from "../types/ObjectType";
import { WarrantRequestOptions } from "../types/WarrantRequestOptions";


export default class Tenant implements WarrantObject {
    tenantId: string;
    meta?: { [key: string]: any }

    constructor(tenantId: string, meta: { [key: string]: any }) {
        this.tenantId = tenantId;
        this.meta = meta;
    }

    //
    // Static methods
    //
    public static async create(params: CreateTenantParams = {}, options: WarrantRequestOptions = {}): Promise<Tenant> {
        const response = await ObjectModule.create({
            object: {
                objectType: ObjectType.Tenant,
                objectId: params.tenantId,
            },
            meta: params.meta,
        }, options);

        return new Tenant(response.objectId, response.meta);
    }

    public static async batchCreate(params: CreateTenantParams[], options: WarrantRequestOptions = {}): Promise<Tenant[]> {
        const response = await ObjectModule.batchCreate(params.map((tenant: CreateTenantParams) => ({
            object: {
                objectType: ObjectType.Tenant,
                objectId: tenant.tenantId,
            },
            meta: tenant.meta,
        })), options);

        return response.map((object: BaseWarrantObject) => new Tenant(object.objectId, object.meta));
    }

    public static async get(params: GetTenantParams, options: WarrantRequestOptions = {}): Promise<Tenant> {
        const response = await ObjectModule.get({
            object: {
                objectType: ObjectType.Tenant,
                objectId: params.tenantId,
            },
        }, options);

        return new Tenant(response.objectId, response.meta);
    }

    public static async update(params: UpdateTenantParams, options: WarrantRequestOptions = {}): Promise<Tenant> {
        const response = await ObjectModule.update({
            object: {
                objectType: ObjectType.Tenant,
                objectId: params.tenantId,
            },
            meta: params.meta,
        }, options);

        return new Tenant(response.objectId, response.meta);
    }

    public static async delete(params: DeleteTenantParams, options: WarrantRequestOptions = {}): Promise<string> {
        return ObjectModule.delete({
            object: {
                objectType: ObjectType.Tenant,
                objectId: params.tenantId,
            },
        }, options);
    }

    public static async batchDelete(params: DeleteTenantParams[], options: WarrantRequestOptions = {}): Promise<string> {
        return await ObjectModule.batchDelete(params.map((tenant: DeleteTenantParams) => ({
            object: {
                objectType: ObjectType.Tenant,
                objectId: tenant.tenantId,
            },
        })), options);
    }

    public static async listTenants(listParams: ListTenantParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Tenant>> {
        const response = await ObjectModule.list({
            objectType: ObjectType.Tenant,
            ...listParams,
        }, options);
        const tenants: Tenant[] = response.results.map((object: BaseWarrantObject) => new Tenant(object.objectId, object.meta));

        return {
            ...response,
            results: tenants,
        };
    }

    public static async listTenantsForUser(userId: string, listParams: ListTenantParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Tenant>> {
        const queryResponse = await WarrantModule.query(`select tenant where user:${userId} is *`, listParams, options);
        const tenants: Tenant[] = queryResponse.results.map((queryResult: QueryResult) => new Tenant(queryResult.objectId, queryResult.meta));

        return {
            ...queryResponse,
            results: tenants,
        };
    }

    //
    // Instance methods
    //
    public async listUsers(listParams: ListUserParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<User>> {
        return User.listUsersForTenant(this.tenantId, listParams, options);
    }

    public async assignUser(userId: string, role: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return User.assignUserToTenant(this.tenantId, userId, role, options);
    }

    public async removeUser(userId: string, role: string, options: WarrantRequestOptions = {}): Promise<string> {
        return User.removeUserFromTenant(this.tenantId, userId, role, options);
    }

    public async listPricingTiers(listParams: ListPricingTierParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<PricingTier>> {
        return PricingTier.listPricingTiersForTenant(this.tenantId, listParams, options);
    }

    public async assignPricingTier(pricingTierId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return PricingTier.assignPricingTierToTenant(this.tenantId, pricingTierId, options);
    }

    public async removePricingTier(pricingTierId: string, options: WarrantRequestOptions = {}): Promise<string> {
        return PricingTier.removePricingTierFromTenant(this.tenantId, pricingTierId, options);
    }

    public async listFeatures(listParams: ListFeatureParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Feature>> {
        return Feature.listFeaturesForTenant(this.tenantId, listParams, options);
    }

    public async assignFeature(featureId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return Feature.assignFeatureToTenant(this.tenantId, featureId, options);
    }

    public async removeFeature(featureId: string, options: WarrantRequestOptions = {}): Promise<string> {
        return Feature.removeFeatureFromTenant(this.tenantId, featureId, options);
    }

    public async hasFeature(params: FeatureCheckParams, options: WarrantRequestOptions = {}): Promise<boolean> {
        return Authorization.hasFeature({ featureId: params.featureId, subject: { objectType: ObjectType.Tenant, objectId: this.tenantId }, context: params.context }, options);
    }

    // WarrantObject methods
    public getObjectType(): string {
        return ObjectType.Tenant;
    }

    public getObjectId(): string {
        return this.tenantId;
    }
}
