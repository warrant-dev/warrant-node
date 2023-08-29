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
import { UserRequestOptions } from "../types/Params";
import { ListPermissionOptions } from "../types/Permission";
import { ListPricingTierOptions } from "../types/PricingTier";
import { ListRoleOptions } from "../types/Role";
import { CreateUserParams, ListUserOptions, UpdateUserParams } from "../types/User";
import { ListTenantOptions } from "../types/Tenant";
import { PolicyContext, WarrantObject } from "../types/Warrant";
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
    public static async create(user: CreateUserParams = {}, options: UserRequestOptions = {}): Promise<User> {
        try {
            const response = await WarrantClient.httpClient.post({
                url: "/v1/users",
                data: user,
                options,
            });

            return new User(response.userId, response.email);
        } catch (e) {
            throw e;
        }
    }

    public static async batchCreate(users: CreateUserParams[], options: UserRequestOptions = {}): Promise<User[]> {
        try {
            const response = await WarrantClient.httpClient.post({
                url: "/v1/users",
                data: users,
                options,
            });

            return response.map((user: User) => new User(user.userId, user.email));
        } catch (e) {
            throw e;
        }
    }

    public static async get(userId: string, options: UserRequestOptions = {}): Promise<User> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/users/${userId}`,
                options,
            });

            return new User(response.userId, response.email);
        } catch (e) {
            throw e;
        }
    }

    public static async update(userId: string, user: UpdateUserParams, options: UserRequestOptions = {}): Promise<User> {
        try {
            const response = await WarrantClient.httpClient.put({
                url: `/v1/users/${userId}`,
                data: user,
                options,
            });

            return new User(response.userId, response.email);
        } catch (e) {
            throw e;
        }
    }

    public static async delete(userId: string, options: UserRequestOptions = {}): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/users/${userId}`,
                options,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async listUsers(listOptions: ListUserOptions = {}, options: UserRequestOptions = {}): Promise<User[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: "/v1/users",
                params: listOptions,
                options,
            });

            return response.map((user: User) => new User(user.userId, user.email));
        } catch (e) {
            throw e;
        }
    }

    public static async listUsersForTenant(tenantId: string, listOptions: ListUserOptions = {}, options: UserRequestOptions = {}): Promise<User[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/tenants/${tenantId}/users`,
                params: listOptions,
                options,
            });

            return response.map((user: User) => new User(user.userId, user.email));
        } catch (e) {
            throw e;
        }
    }

    public static async assignUserToTenant(tenantId: string, userId: string, role: string, options: UserRequestOptions = {}): Promise<Warrant> {
        return WarrantModule.create({
            object: {
                objectType: ObjectType.Tenant,
                objectId: tenantId,
            },
            relation: role,
            subject: {
                objectType: ObjectType.User,
                objectId: userId,
            }
        }, options);
    }

    public static async removeUserFromTenant(tenantId: string, userId: string, role: string, options: UserRequestOptions = {}): Promise<void> {
        return WarrantModule.delete({
            object: {
                objectType: ObjectType.Tenant,
                objectId: tenantId,
            },
            relation: role,
            subject: {
                objectType: ObjectType.User,
                objectId: userId,
            }
        }, options);
    }

    //
    // Instance methods
    //
    public async listTenants(listOptions: ListTenantOptions = {}, options: UserRequestOptions = {}): Promise<Tenant[]> {
        return Tenant.listTenantsForUser(this.userId, listOptions, options);
    }

    public async listRoles(listOptions: ListRoleOptions = {}, options: UserRequestOptions = {}): Promise<Role[]> {
        return Role.listRolesForUser(this.userId, listOptions, options);
    }

    public async assignRole(roleId: string, options: UserRequestOptions = {}): Promise<Warrant> {
        return Role.assignRoleToUser(this.userId, roleId, options);
    }

    public async removeRole(roleId: string, options: UserRequestOptions = {}): Promise<void> {
        return Role.removeRoleFromUser(this.userId, roleId, options);
    }

    public async listPermissions(listOptions: ListPermissionOptions = {}, options: UserRequestOptions = {}): Promise<Permission[]> {
        return Permission.listPermissionsForUser(this.userId, listOptions, options);
    }

    public async assignPermission(permissionId: string, options: UserRequestOptions = {}): Promise<Warrant> {
        return Permission.assignPermissionToUser(this.userId, permissionId, options);
    }

    public async removePermission(permissionId: string, options: UserRequestOptions = {}): Promise<void> {
        return Permission.removePermissionFromUser(this.userId, permissionId, options);
    }

    public async hasPermission(permissionId: string, context: PolicyContext = {}, options: UserRequestOptions = {}): Promise<boolean> {
        return Authorization.hasPermission({ permissionId: permissionId, subject: { objectType: ObjectType.User, objectId: this.userId }, context: context }, options);
    }

    public async listPricingTiers(listOptions: ListPricingTierOptions = {}, options: UserRequestOptions = {}): Promise<PricingTier[]> {
        return PricingTier.listPricingTiersForUser(this.userId, listOptions, options);
    }

    public async assignPricingTier(pricingTierId: string, options: UserRequestOptions = {}): Promise<Warrant> {
        return PricingTier.assignPricingTierToUser(this.userId, pricingTierId, options);
    }

    public async removePricingTier(pricingTierId: string, options: UserRequestOptions = {}): Promise<void> {
        return PricingTier.removePricingTierFromUser(this.userId, pricingTierId, options);
    }

    public async listFeatures(listOptions: ListFeatureOptions = {}, options: UserRequestOptions = {}): Promise<Feature[]> {
        return Feature.listFeaturesForUser(this.userId, listOptions, options);
    }

    public async assignFeature(featureId: string, options: UserRequestOptions = {}): Promise<Warrant> {
        return Feature.assignFeatureToUser(this.userId, featureId, options);
    }

    public async removeFeature(featureId: string, options: UserRequestOptions = {}): Promise<void> {
        return Feature.removeFeatureFromUser(this.userId, featureId, options);
    }

    public async hasFeature(featureId: string, context: PolicyContext = {}, options: UserRequestOptions = {}): Promise<boolean> {
        return Authorization.hasFeature({ featureId: featureId, subject: { objectType: ObjectType.User, objectId: this.userId }, context: context }, options);
    }

    // WarrantObject methods
    public getObjectType(): string {
        return ObjectType.User;
    }

    public getObjectId(): string {
        return this.userId;
    }
}
