import Authorization from "./Authorization";
import Feature from "./Feature";
import Permission from "./Permission";
import PricingTier from "./PricingTier";
import Role from "./Role";
import Tenant from "./Tenant";
import WarrantClient from "../WarrantClient";
import Warrant from "./WarrantModule";
import { ListFeatureOptions } from "../types/Feature";
import { ObjectType } from "../types/ObjectType";
import { ListPermissionOptions } from "../types/Permission";
import { ListPricingTierOptions } from "../types/PricingTier";
import { ListRoleOptions } from "../types/Role";
import { CreateUserParams, ListUserOptions, UpdateUserParams } from "../types/User";
import { ListTenantOptions } from "../types/Tenant";
import { Context, WarrantObject } from "../types/Warrant";

export default class User implements WarrantObject {
    userId: string;
    email?: string;

    constructor(userId: string, email?: string) {
        this.userId = userId;
        this.email = email;
    }

    //
    // Static methods
    //
    public static async create(user: CreateUserParams = {}): Promise<User> {
        try {
            return await WarrantClient.httpClient.post({
                url: "/v1/users",
                data: user,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async batchCreate(users: CreateUserParams[]): Promise<User[]> {
        try {
            return await WarrantClient.httpClient.post({
                url: "/v1/users",
                data: users,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async get(userId: string): Promise<User> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/users/${userId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async update(userId: string, user: UpdateUserParams): Promise<User> {
        try {
            return await WarrantClient.httpClient.put({
                url: `/v1/users/${userId}`,
                data: user,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async delete(userId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/users/${userId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async listUsers(listOptions: ListUserOptions = {}): Promise<User[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: "/v1/users",
                params: listOptions,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async listUsersForTenant(tenantId: string, listOptions: ListUserOptions = {}): Promise<User[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/tenants/${tenantId}/users`,
                params: listOptions,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async assignUserToTenant(tenantId: string, userId: string): Promise<Warrant> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/tenants/${tenantId}/users/${userId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async removeUserFromTenant(tenantId: string, userId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/tenants/${tenantId}/users/${userId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    //
    // Instance methods
    //
    public async listTenants(listOptions: ListTenantOptions = {}): Promise<Tenant[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/users/${this.userId}/tenants`,
                params: listOptions,
            });
        } catch (e) {
            throw e;
        }
    }

    public async listRoles(listOptions: ListRoleOptions = {}): Promise<Role[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/users/${this.userId}/roles`,
                params: listOptions,
            });
        } catch (e) {
            throw e;
        }
    }

    public async assignRole(roleId: string): Promise<Role> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/users/${this.userId}/roles/${roleId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public async removeRole(roleId: string): Promise<void> {
        try {
            await WarrantClient.httpClient.delete({
                url: `/v1/users/${this.userId}/roles/${roleId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public async listPermissions(listOptions: ListPermissionOptions = {}): Promise<Permission[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/users/${this.userId}/permissions`,
                params: listOptions,
            });
        } catch (e) {
            throw e;
        }
    }

    public async assignPermission(permissionId: string): Promise<Permission> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/users/${this.userId}/permissions/${permissionId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public async removePermission(permissionId: string): Promise<void> {
        try {
            await WarrantClient.httpClient.delete({
                url: `/v1/users/${this.userId}/permissions/${permissionId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public async hasPermission(permissionId: string, context: Context = {}): Promise<boolean> {
        return Authorization.hasPermission({ permissionId: permissionId, subject: { objectType: ObjectType.User, objectId: this.userId }, context: context });
    }

    public async listPricingTiers(listOptions: ListPricingTierOptions = {}): Promise<PricingTier[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/users/${this.userId}/pricing-tiers`,
                params: listOptions,
            });
        } catch (e) {
            throw e;
        }
    }

    public async assignPricingTier(pricingTierId: string): Promise<PricingTier> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/users/${this.userId}/pricing-tiers/${pricingTierId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public async removePricingTier(pricingTierId: string): Promise<void> {
        try {
            await WarrantClient.httpClient.delete({
                url: `/v1/users/${this.userId}/pricing-tiers/${pricingTierId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public async listFeatures(listOptions: ListFeatureOptions = {}): Promise<Feature[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/users/${this.userId}/features`,
                params: listOptions,
            });
        } catch (e) {
            throw e;
        }
    }

    public async assignFeature(featureId: string): Promise<Feature> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/users/${this.userId}/features/${featureId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public async removeFeature(featureId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/users/${this.userId}/features/${featureId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public async hasFeature(featureId: string, context: Context = {}): Promise<boolean> {
        return Authorization.hasFeature({ featureId: featureId, subject: { objectType: ObjectType.User, objectId: this.userId }, context: context });
    }

    // WarrantObject methods
    public getObjectType(): string {
        return ObjectType.User;
    }

    public getObjectId(): string {
        return this.userId;
    }
}
