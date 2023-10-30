import Authorization from "./Authorization";
import Feature from "./Feature";
import ObjectModule from "./ObjectModule";
import PricingTier from "./PricingTier";
import User from "./User";
import WarrantModule from "./WarrantModule";
import { ListFeatureOptions } from "../types/Feature";
import { ListResponse } from "../types/List";
import { WarrantObject, WarrantObjectLiteral } from "../types/Object";
import { ObjectType } from "../types/ObjectType";
import { ListPricingTierOptions } from "../types/PricingTier";
import { QueryResult } from "../types/Query";
import { CreateTenantParams, DeleteTenantParams, ListTenantOptions } from "../types/Tenant";
import { ListUserOptions } from "../types/User";
import Warrant, { PolicyContext } from "../types/Warrant";
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
    public static async create(tenant: CreateTenantParams = {}, options: WarrantRequestOptions = {}): Promise<Tenant> {
        try {
            const response = await ObjectModule.create({
                object: {
                    objectType: ObjectType.Tenant,
                    objectId: tenant.tenantId,
                },
                meta: tenant.meta,
            }, options);

            return new Tenant(response.objectId, response.meta);
        } catch (e) {
            throw e;
        }
    }

    public static async batchCreate(tenants: CreateTenantParams[], options: WarrantRequestOptions = {}): Promise<Tenant[]> {
        try {
            const objects = tenants.map((tenant: CreateTenantParams) => { return { object: { objectType: ObjectType.Tenant, objectId: tenant.tenantId }, meta: tenant.meta } });
            const response = await ObjectModule.batchCreate(objects, options);

            return response.map((object: WarrantObjectLiteral) => new Tenant(object.objectId, object.meta));
        } catch (e) {
            throw e;
        }
    }

    public static async get(tenantId: string, options: WarrantRequestOptions = {}): Promise<Tenant> {
        try {
            const response = await ObjectModule.get(ObjectType.Tenant, tenantId, options);

            return new Tenant(response.objectId, response.meta);
        } catch (e) {
            throw e;
        }
    }

    public static async update(tenantId: string, meta: { [key: string]: any }, options: WarrantRequestOptions = {}): Promise<Tenant> {
        try {
            const response = await ObjectModule.update({
                objectType: ObjectType.Tenant,
                objectId: tenantId,
            }, meta, options);

            return new Tenant(response.objectId, response.meta);
        } catch (e) {
            throw e;
        }
    }

    public static async delete(tenantId: string, options: WarrantRequestOptions = {}): Promise<string> {
        return ObjectModule.delete({
            objectType: ObjectType.Tenant,
            objectId: tenantId,
        }, options);
    }

    public static async batchDelete(tenants: DeleteTenantParams[], options: WarrantRequestOptions = {}): Promise<string> {
        try {
            const objects = tenants.map((tenant: DeleteTenantParams) => { return { object: { objectType: ObjectType.Tenant, objectId: tenant.tenantId } }})
            return await ObjectModule.batchDelete(objects, options);
        } catch (e) {
            throw e;
        }
    }

    public static async listTenants(listOptions: ListTenantOptions = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Tenant>> {
        try {
            const response = await ObjectModule.list({
                objectType: ObjectType.Tenant,
                ...listOptions,
            }, options);
            const tenants: Tenant[] = response.results.map((object: WarrantObjectLiteral) => new Tenant(object.objectId, object.meta));

            return {
                ...response,
                results: tenants,
            };
        } catch (e) {
            throw e;
        }
    }

    public static async listTenantsForUser(userId: string, listOptions: ListTenantOptions = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Tenant>> {
        try {
            const queryResponse = await WarrantModule.query(`select tenant where user:${userId} is *`, listOptions, options);
            const tenants: Tenant[] = queryResponse.results.map((queryResult: QueryResult) => new Tenant(queryResult.objectId, queryResult.meta));

            return {
                ...queryResponse,
                results: tenants,
            };
        } catch (e) {
            throw e;
        }
    }

    //
    // Instance methods
    //
    public async listUsers(listOptions: ListUserOptions = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<User>> {
        return User.listUsersForTenant(this.tenantId, listOptions, options);
    }

    public async assignUser(userId: string, role: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return User.assignUserToTenant(this.tenantId, userId, role, options);
    }

    public async removeUser(userId: string, role: string, options: WarrantRequestOptions = {}): Promise<string> {
        return User.removeUserFromTenant(this.tenantId, userId, role, options);
    }

    public async listPricingTiers(listOptions: ListPricingTierOptions = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<PricingTier>> {
        return PricingTier.listPricingTiersForTenant(this.tenantId, listOptions, options);
    }

    public async assignPricingTier(pricingTierId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return PricingTier.assignPricingTierToTenant(this.tenantId, pricingTierId, options);
    }

    public async removePricingTier(pricingTierId: string, options: WarrantRequestOptions = {}): Promise<string> {
        return PricingTier.removePricingTierFromTenant(this.tenantId, pricingTierId, options);
    }

    public async listFeatures(listOptions: ListFeatureOptions = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Feature>> {
        return Feature.listFeaturesForTenant(this.tenantId, listOptions, options);
    }

    public async assignFeature(featureId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return Feature.assignFeatureToTenant(this.tenantId, featureId, options);
    }

    public async removeFeature(featureId: string, options: WarrantRequestOptions = {}): Promise<string> {
        return Feature.removeFeatureFromTenant(this.tenantId, featureId, options);
    }

    public async hasFeature(featureId: string, context: PolicyContext = {}, options: WarrantRequestOptions = {}): Promise<boolean> {
        return Authorization.hasFeature({ featureId: featureId, subject: { objectType: ObjectType.Tenant, objectId: this.tenantId }, context: context }, options);
    }

    // WarrantObject methods
    public getObjectType(): string {
        return ObjectType.Tenant;
    }

    public getObjectId(): string {
        return this.tenantId;
    }
}
