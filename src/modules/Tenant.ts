import Authorization from "./Authorization";
import Feature from "./Feature";
import PricingTier from "./PricingTier";
import User from "./User";
import WarrantClient from "../WarrantClient";
import Warrant from "./WarrantModule";
import { ListFeatureOptions } from "../types/Feature";
import { ObjectType } from "../types/ObjectType";
import { UserRequestOptions } from "../types/Params";
import { ListPricingTierOptions } from "../types/PricingTier";
import { CreateTenantParams, ListTenantOptions, UpdateTenantParams } from "../types/Tenant";
import { ListUserOptions } from "../types/User";
import { PolicyContext, WarrantObject } from "../types/Warrant";

export default class Tenant implements WarrantObject {
    // Tenant properties
    tenantId: string;
    name?: string;

    constructor(tenantId: string, name?: string) {
        this.tenantId = tenantId;
        this.name = name;
    }

    //
    // Static methods
    //
    public static async create(tenant: CreateTenantParams = {}, options: UserRequestOptions = {}): Promise<Tenant> {
        try {
            const response = await WarrantClient.httpClient.post({
                url: "/v1/tenants",
                data: tenant,
                options,
            });

            return new Tenant(response.tenantId, response.name);
        } catch (e) {
            throw e;
        }
    }

    public static async batchCreate(tenants: CreateTenantParams[], options: UserRequestOptions = {}): Promise<Tenant[]> {
        try {
            const response = await WarrantClient.httpClient.post({
                url: "/v1/tenants",
                data: tenants,
                options,
            });

            return response.map((tenant: Tenant) => new Tenant(tenant.tenantId, tenant.name));
        } catch (e) {
            throw e;
        }
    }

    public static async get(tenantId: string, options: UserRequestOptions = {}): Promise<Tenant> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/tenants/${tenantId}`,
                options,
            });

            return new Tenant(response.tenantId, response.name);
        } catch (e) {
            throw e;
        }
    }

    public static async update(tenantId: string, tenant: UpdateTenantParams, options: UserRequestOptions = {}): Promise<Tenant> {
        try {
            const response = await WarrantClient.httpClient.put({
                url: `/v1/tenants/${tenantId}`,
                data: tenant,
                options,
            });

            return new Tenant(response.tenantId, response.name);
        } catch (e) {
            throw e;
        }
    }

    public static async delete(tenantId: string, options: UserRequestOptions = {}): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/tenants/${tenantId}`,
                options,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async listTenants(listOptions: ListTenantOptions = {}, options: UserRequestOptions = {}): Promise<Tenant[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: "/v1/tenants",
                params: listOptions,
                options,
            });

            return response.map((tenant: Tenant) => new Tenant(tenant.tenantId, tenant.name));
        } catch (e) {
            throw e;
        }
    }

    public static async listTenantsForUser(userId: string, listOptions: ListTenantOptions = {}, options: UserRequestOptions = {}): Promise<Tenant[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/users/${userId}/tenants`,
                params: listOptions,
                options,
            });

            return response.map((tenant: Tenant) => new Tenant(tenant.tenantId, tenant.name));
        } catch (e) {
            throw e;
        }
    }

    //
    // Instance methods
    //
    public async listUsers(listOptions: ListUserOptions = {}, options: UserRequestOptions = {}): Promise<User[]> {
        return User.listUsersForTenant(this.tenantId, listOptions, options);
    }

    public async assignUser(userId: string, role: string, options: UserRequestOptions = {}): Promise<Warrant> {
        return User.assignUserToTenant(this.tenantId, userId, role, options);
    }

    public async removeUser(userId: string, role: string, options: UserRequestOptions = {}): Promise<void> {
        return User.removeUserFromTenant(this.tenantId, userId, role, options);
    }

    public async listPricingTiers(listOptions: ListPricingTierOptions = {}, options: UserRequestOptions = {}): Promise<PricingTier[]> {
        return PricingTier.listPricingTiersForTenant(this.tenantId, listOptions, options);
    }

    public async assignPricingTier(pricingTierId: string, options: UserRequestOptions = {}): Promise<Warrant> {
        return PricingTier.assignPricingTierToTenant(this.tenantId, pricingTierId, options);
    }

    public async removePricingTier(pricingTierId: string, options: UserRequestOptions = {}): Promise<void> {
        return PricingTier.removePricingTierFromTenant(this.tenantId, pricingTierId, options);
    }

    public async listFeatures(listOptions: ListFeatureOptions = {}, options: UserRequestOptions = {}): Promise<Feature[]> {
        return Feature.listFeaturesForTenant(this.tenantId, listOptions, options);
    }

    public async assignFeature(featureId: string, options: UserRequestOptions = {}): Promise<Warrant> {
        return Feature.assignFeatureToTenant(this.tenantId, featureId, options);
    }

    public async removeFeature(featureId: string, options: UserRequestOptions = {}): Promise<void> {
        return Feature.removeFeatureFromTenant(this.tenantId, featureId, options);
    }

    public async hasFeature(featureId: string, context: PolicyContext = {}, options: UserRequestOptions = {}): Promise<boolean> {
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
