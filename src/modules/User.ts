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
import WarrantModule from "./WarrantModule";

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
            const response = await WarrantClient.httpClient.post({
                url: "/v1/users",
                data: user,
            });

            return new User(response.userId, response.email);
        } catch (e) {
            throw e;
        }
    }

    public static async batchCreate(users: CreateUserParams[]): Promise<User[]> {
        try {
            const response = await WarrantClient.httpClient.post({
                url: "/v1/users",
                data: users,
            });

            return response.map((user: User) => new User(user.userId, user.email));
        } catch (e) {
            throw e;
        }
    }

    public static async get(userId: string): Promise<User> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/users/${userId}`,
            });

            return new User(response.userId, response.email);
        } catch (e) {
            throw e;
        }
    }

    public static async update(userId: string, user: UpdateUserParams): Promise<User> {
        try {
            const response = await WarrantClient.httpClient.put({
                url: `/v1/users/${userId}`,
                data: user,
            });

            return new User(response.userId, response.email);
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
            const response = await WarrantClient.httpClient.get({
                url: "/v1/users",
                params: listOptions,
            });

            return response.map((user: User) => new User(user.userId, user.email));
        } catch (e) {
            throw e;
        }
    }

    public static async listUsersForTenant(tenantId: string, listOptions: ListUserOptions = {}): Promise<User[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/tenants/${tenantId}/users`,
                params: listOptions,
            });

            return response.map((user: User) => new User(user.userId, user.email));
        } catch (e) {
            throw e;
        }
    }

    public static async assignUserToTenant(tenantId: string, userId: string, role: string): Promise<Warrant> {
        return WarrantModule.create({
            object: {
                objectType: "tenant",
                objectId: tenantId,
            },
            relation: role,
            subject: {
                objectType: "user",
                objectId: userId,
            }
        });
    }

    public static async removeUserFromTenant(tenantId: string, userId: string, role: string): Promise<void> {
        return WarrantModule.delete({
            object: {
                objectType: "tenant",
                objectId: tenantId,
            },
            relation: role,
            subject: {
                objectType: "user",
                objectId: userId,
            }
        });
    }

    //
    // Instance methods
    //
    public async listTenants(listOptions: ListTenantOptions = {}): Promise<Tenant[]> {
        return Tenant.listTenantsForUser(this.userId, listOptions);
    }

    public async listRoles(listOptions: ListRoleOptions = {}): Promise<Role[]> {
        return Role.listRolesForUser(this.userId, listOptions);
    }

    public async assignRole(roleId: string): Promise<Warrant> {
        return Role.assignRoleToUser(this.userId, roleId);
    }

    public async removeRole(roleId: string): Promise<void> {
        return Role.removeRoleFromUser(this.userId, roleId);
    }

    public async listPermissions(listOptions: ListPermissionOptions = {}): Promise<Permission[]> {
        return Permission.listPermissionsForUser(this.userId, listOptions);
    }

    public async assignPermission(permissionId: string): Promise<Warrant> {
        return Permission.assignPermissionToUser(this.userId, permissionId);
    }

    public async removePermission(permissionId: string): Promise<void> {
        return Permission.removePermissionFromUser(this.userId, permissionId);
    }

    public async hasPermission(permissionId: string, context: Context = {}): Promise<boolean> {
        return Authorization.hasPermission({ permissionId: permissionId, subject: { objectType: ObjectType.User, objectId: this.userId }, context: context });
    }

    public async listPricingTiers(listOptions: ListPricingTierOptions = {}): Promise<PricingTier[]> {
        return PricingTier.listPricingTiersForUser(this.userId, listOptions);
    }

    public async assignPricingTier(pricingTierId: string): Promise<Warrant> {
        return PricingTier.assignPricingTierToUser(this.userId, pricingTierId);
    }

    public async removePricingTier(pricingTierId: string): Promise<void> {
        return PricingTier.removePricingTierFromUser(this.userId, pricingTierId);
    }

    public async listFeatures(listOptions: ListFeatureOptions = {}): Promise<Feature[]> {
        return Feature.listFeaturesForUser(this.userId, listOptions);
    }

    public async assignFeature(featureId: string): Promise<Warrant> {
        return Feature.assignFeatureToUser(this.userId, featureId);
    }

    public async removeFeature(featureId: string): Promise<void> {
        return Feature.removeFeatureFromUser(this.userId, featureId);
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
