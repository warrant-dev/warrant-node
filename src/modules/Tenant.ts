import Authorization from "./Authorization";
import Feature from "./Feature";
import PricingTier from "./PricingTier";
import User from "./User";
import WarrantClient from "../WarrantClient";
import Warrant from "./WarrantModule";
import { ListFeatureOptions } from "../types/Feature";
import { ObjectType } from "../types/ObjectType";
import { ListPricingTierOptions } from "../types/PricingTier";
import { CreateTenantParams, ListTenantOptions, UpdateTenantParams } from "../types/Tenant";
import { ListUserOptions } from "../types/User";
import { Context, WarrantObject } from "../types/Warrant";

export default class Tenant {
    // WarrantObject properties
    objectType: string = ObjectType.Tenant;
    objectId: string;

    // Tenant properties
    tenantId: string;
    name?: string;

    constructor(tenantId: string, name?: string) {
        this.objectId = tenantId;
        this.tenantId = tenantId;
        this.name = name;
    }

    //
    // Static methods
    //
    public static async create(tenant: CreateTenantParams): Promise<Tenant> {
        try {
            return await WarrantClient.httpClient.post({
                url: "/v1/tenants",
                data: tenant,
            });
        } catch (e) {
            console.log("Error creating tenant");
            throw e;
        }
    }

    public static async get(tenantId: string): Promise<Tenant> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/tenants/${tenantId}`,
            });
        } catch (e) {
            console.log("Error getting tenant");
            throw e;
        }
    }

    public static async update(tenantId: string, tenant: UpdateTenantParams): Promise<Tenant> {
        try {
            return await WarrantClient.httpClient.put({
                url: `/v1/tenants/${tenantId}`,
                data: tenant,
            });
        } catch (e) {
            console.log("Error updating tenant");
            throw e;
        }
    }

    public static async delete(tenantId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/tenants/${tenantId}`,
            });
        } catch (e) {
            console.log("Error deleting tenant");
            throw e;
        }
    }

    public static async listTenants(listOptions: ListTenantOptions = {}): Promise<Tenant[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: "/v1/tenants",
                params: listOptions,
            });
        } catch (e) {
            console.log("Error listing tenants");
            throw e;
        }
    }

    public static async listTenantsForUser(userId: string, listOptions: ListTenantOptions = {}): Promise<Tenant[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/users/${userId}/tenants`,
                params: listOptions,
            });
        } catch (e) {
            console.log("Error listing tenants for user");
            throw e;
        }
    }

    //
    // Instance methods
    //
    public async addUser(userId: string): Promise<Warrant> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/tenants/${this.tenantId}/users/${userId}`,
            });
        } catch (e) {
            console.log("Error adding user to tenant");
            throw e;
        }
    }

    public async removeUser(userId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/tenants/${this.tenantId}/users/${userId}`,
            });
        } catch (e) {
            console.log("Error removing user from tenant");
            throw e;
        }
    }

    public async listUsers(listOptions: ListUserOptions = {}): Promise<User[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/tenants/${this.tenantId}/users`,
                params: listOptions,
            });
        } catch (e) {
            console.log("Error listing users for tenant");
            throw e;
        }
    }

    public async listPricingTiers(listOptions: ListPricingTierOptions = {}): Promise<PricingTier[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/tenants/${this.tenantId}/pricing-tiers`,
                params: listOptions,
            });
        } catch (e) {
            console.log("Error listing pricing tiers for tenant");
            throw e;
        }
    }

    public async assignPricingTier(pricingTierId: string): Promise<PricingTier> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/tenants/${this.tenantId}/pricing-tiers/${pricingTierId}`,
            });
        } catch (e) {
            console.log("Error assigning pricing tier to tenant");
            throw e;
        }
    }

    public async removePricingTier(pricingTierId: string): Promise<void> {
        try {
            await WarrantClient.httpClient.delete({
                url: `/v1/tenants/${this.tenantId}/pricing-tiers/${pricingTierId}`,
            });
        } catch (e) {
            console.log("Error removing pricing tier from tenant");
            throw e;
        }
    }

    public async listFeatures(listOptions: ListFeatureOptions = {}): Promise<Feature[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/tenants/${this.tenantId}/features`,
                params: listOptions,
            });
        } catch (e) {
            console.log("Error listing features for tenant");
            throw e;
        }
    }

    public async addFeature(featureId: string): Promise<Feature> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/tenants/${this.tenantId}/features/${featureId}`,
            });
        } catch (e) {
            console.log("Error adding feature to tenant");
            throw e;
        }
    }

    public async removeFeature(featureId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/tenants/${this.tenantId}/features/${featureId}`,
            });
        } catch (e) {
            console.log("Error removing feature from tenant");
            throw e;
        }
    }

    public async hasFeature(featureId: string, context: Context = {}): Promise<boolean> {
        return Authorization.hasFeature({ featureId: featureId, subject: { objectType: ObjectType.Tenant, objectId: this.tenantId }, context: context });
    }
}
