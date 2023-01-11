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

export default class Tenant implements WarrantObject {
    tenantId: string;
    name?: string;

    constructor(tenantId: string, name?: string) {
        this.tenantId = tenantId;
        this.name = name;
    }

    //
    // Static methods
    //
    public static async create(tenant: CreateTenantParams = {}): Promise<Tenant> {
        return WarrantClient.httpClient
            .post({
                url: "/v1/tenants",
                data: tenant,
            })
            .then((res) => new Tenant(res.tenantId, res.name))
            .catch((e) => {
                throw e;
            });
    }

    public static async batchCreate(tenants: CreateTenantParams[]): Promise<Tenant[]> {
        return WarrantClient.httpClient
            .post({
                url: "/v1/tenants",
                data: tenants,
            })
            .then((res) => res.map((tenant: Tenant) => new Tenant(tenant.tenantId, tenant.name)))
            .catch((e) => {
                throw e;
            });
    }

    public static async get(tenantId: string): Promise<Tenant> {
        return WarrantClient.httpClient
            .get({
                url: `/v1/tenants/${tenantId}`,
            })
            .then((res) => new Tenant(res.tenantId, res.name))
            .catch((e) => {
                throw e;
            });
    }

    public static async update(tenantId: string, tenant: UpdateTenantParams): Promise<Tenant> {
        return WarrantClient.httpClient
            .put({
                url: `/v1/tenants/${tenantId}`,
                data: tenant,
            })
            .then((res) => new Tenant(res.tenantId, res.name))
            .catch((e) => {
                throw e;
            });
    }

    public static async delete(tenantId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/tenants/${tenantId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async listTenants(listOptions: ListTenantOptions = {}): Promise<Tenant[]> {
        return  WarrantClient.httpClient
            .get({
                url: "/v1/tenants",
                params: listOptions,
            })
            .then((res) => res.map((tenant: Tenant) => new Tenant(tenant.tenantId, tenant.name)))
            .catch((e) => {
                throw e;
            });
    }

    public static async listTenantsForUser(userId: string, listOptions: ListTenantOptions = {}): Promise<Tenant[]> {
        return WarrantClient.httpClient
            .get({
                url: `/v1/users/${userId}/tenants`,
                params: listOptions,
            })
            .then((res) => res.map((tenant: Tenant) => new Tenant(tenant.tenantId, tenant.name)))
            .catch((e) => {
                throw e;
            });;
    }

    //
    // Instance methods
    //
    public async listUsers(listOptions: ListUserOptions = {}): Promise<User[]> {
        return User.listUsersForTenant(this.tenantId, listOptions);
    }

    public async assignUser(userId: string): Promise<Warrant> {
        return User.assignUserToTenant(this.tenantId, userId);
    }

    public async removeUser(userId: string): Promise<void> {
        return User.removeUserFromTenant(this.tenantId, userId);
    }

    public async listPricingTiers(listOptions: ListPricingTierOptions = {}): Promise<PricingTier[]> {
        return PricingTier.listPricingTiersForTenant(this.tenantId, listOptions);
    }

    public async assignPricingTier(pricingTierId: string): Promise<PricingTier> {
        return PricingTier.assignPricingTierToTenant(this.tenantId, pricingTierId);
    }

    public async removePricingTier(pricingTierId: string): Promise<void> {
        return PricingTier.removePricingTierFromTenant(this.tenantId, pricingTierId);
    }

    public async listFeatures(listOptions: ListFeatureOptions = {}): Promise<Feature[]> {
        return Feature.listFeaturesForTenant(this.tenantId, listOptions);
    }

    public async assignFeature(featureId: string): Promise<Feature> {
        return Feature.assignFeatureToTenant(this.tenantId, featureId);
    }

    public async removeFeature(featureId: string): Promise<void> {
        return Feature.removeFeatureFromTenant(this.tenantId, featureId);
    }

    public async hasFeature(featureId: string, context: Context = {}): Promise<boolean> {
        return Authorization.hasFeature({ featureId: featureId, subject: { objectType: ObjectType.Tenant, objectId: this.tenantId }, context: context });
    }

    // WarrantObject methods
    public getObjectType(): string {
        return ObjectType.Tenant;
    }

    public getObjectId(): string {
        return this.tenantId;
    }
}
