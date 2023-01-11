import Authorization from "./Authorization";
import Feature from "./Feature";
import Permission from "./Permission";
import PricingTier from "./PricingTier";
import Role from "./Role";
import Tenant from "./Tenant";
import WarrantClient from "../WarrantClient";
import Warrant from "./WarrantModule";
import { USER_OBJECT_TYPE } from "../constants";
import { ListFeatureOptions } from "../types/Feature";
import { ListPermissionOptions } from "../types/Permission";
import { ListPricingTierOptions } from "../types/PricingTier";
import { ListRoleOptions } from "../types/Role";
import { CreateUserParams, ListUserOptions, UpdateUserParams } from "../types/User";
import { ListTenantOptions } from "../types/Tenant";
import { Context } from "../types/Warrant";

export default class User {
    userId: string;
    email?: string;

    constructor(userId: string, email?: string) {
        this.userId = userId;
        this.email = email;
    }

    //
    // Static methods
    //
    public static async create(user: CreateUserParams): Promise<User> {
        try {
            return await WarrantClient.httpClient.post({
                url: "/v1/users",
                data: user,
            });
        } catch (e) {
            console.log("Error creating user");
            throw e;
        }
    }

    public static async get(userId: string): Promise<User> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/users/${userId}`,
            });
        } catch (e) {
            console.log("Error getting user");
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
            console.log("Error updating user");
            throw e;
        }
    }

    public static async delete(userId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/users/${userId}`,
            });
        } catch (e) {
            console.log("Error deleting user");
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
            console.log("Error listing users");
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
            console.log("Error listing users for tenant");
            throw e;
        }
    }

    public static async addUserToTenant(tenantId: string, userId: string): Promise<Warrant> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/tenants/${tenantId}/users/${userId}`,
            });
        } catch (e) {
            console.log("Error adding user to tenant");
            throw e;
        }
    }

    public static async removeUserFromTenant(tenantId: string, userId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/tenants/${tenantId}/users/${userId}`,
            });
        } catch (e) {
            console.log("Error removing user from tenant");
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
            console.log("Error listing tenants for user");
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
            console.log("Error listing roles for user");
            throw e;
        }
    }

    public async assignRole(roleId: string): Promise<Role> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/users/${this.userId}/roles/${roleId}`,
            });
        } catch (e) {
            console.log("Error assigning role to user");
            throw e;
        }
    }

    public async removeRole(roleId: string): Promise<void> {
        try {
            await WarrantClient.httpClient.delete({
                url: `/v1/users/${this.userId}/roles/${roleId}`,
            });
        } catch (e) {
            console.log("Error removing role from user");
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
            console.log("Error listing permissions for user");
            throw e;
        }
    }

    public async assignPermission(permissionId: string): Promise<Permission> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/users/${this.userId}/permissions/${permissionId}`,
            });
        } catch (e) {
            console.log("Error assigning permission to user");
            throw e;
        }
    }

    public async removePermission(permissionId: string): Promise<void> {
        try {
            await WarrantClient.httpClient.delete({
                url: `/v1/users/${this.userId}/permissions/${permissionId}`,
            });
        } catch (e) {
            console.log("Error removing permission from user");
            throw e;
        }
    }

    public async hasPermission(permissionId: string, context: Context = {}): Promise<boolean> {
        return Authorization.hasPermission({ permissionId: permissionId, subject: { objectType: USER_OBJECT_TYPE, objectId: this.userId }, context: context });
    }

    public async listPricingTiers(listOptions: ListPricingTierOptions = {}): Promise<PricingTier[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/users/${this.userId}/pricing-tiers`,
                params: listOptions,
            });
        } catch (e) {
            console.log("Error listing pricing tiers for user");
            throw e;
        }
    }

    public async assignPricingTier(pricingTierId: string): Promise<PricingTier> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/users/${this.userId}/pricing-tiers/${pricingTierId}`,
            });
        } catch (e) {
            console.log("Error assigning pricing tier to user");
            throw e;
        }
    }

    public async removePricingTier(pricingTierId: string): Promise<void> {
        try {
            await WarrantClient.httpClient.delete({
                url: `/v1/users/${this.userId}/pricing-tiers/${pricingTierId}`,
            });
        } catch (e) {
            console.log("Error removing pricing tier from user");
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
            console.log("Error listing features for user");
            throw e;
        }
    }

    public async addFeature(featureId: string): Promise<Feature> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/users/${this.userId}/features/${featureId}`,
            });
        } catch (e) {
            console.log("Error adding feature to user");
            throw e;
        }
    }

    public async removeFeature(featureId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/users/${this.userId}/features/${featureId}`,
            });
        } catch (e) {
            console.log("Error removing feature from user");
            throw e;
        }
    }

    public async hasFeature(featureId: string, context: Context = {}): Promise<boolean> {
        return Authorization.hasFeature({ featureId: featureId, subject: { objectType: USER_OBJECT_TYPE, objectId: this.userId }, context: context });
    }
}
