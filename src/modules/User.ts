import Authorization from "./Authorization";
import Feature, { ListFeaturesResult } from "./Feature";
import ObjectModule from "./ObjectModule";
import Permission, { ListPermissionsResult } from "./Permission";
import PricingTier, { ListPricingTiersResult } from "./PricingTier";
import Role, { ListRolesResult } from "./Role";
import Tenant, { ListTenantsResult } from "./Tenant";
import WarrantModule from "./WarrantModule";
import { ListFeatureOptions } from "../types/Feature";
import { WarrantObject, WarrantObjectLiteral } from "../types/Object";
import { ObjectType } from "../types/ObjectType";
import { ListPermissionOptions } from "../types/Permission";
import { ListPricingTierOptions } from "../types/PricingTier";
import { QueryResult } from "../types/Query";
import { ListRoleOptions } from "../types/Role";
import { CreateUserParams, DeleteUserParams, ListUserOptions } from "../types/User";
import { ListTenantOptions } from "../types/Tenant";
import Warrant, { PolicyContext } from "../types/Warrant";
import { WarrantRequestOptions } from "../types/WarrantRequestOptions";

export interface ListUsersResult {
    results: User[];
    prevCursor?: string;
    nextCursor?: string;
}

export default class User implements WarrantObject {
    userId: string;
    meta?: { [key: string]: any }

    constructor(userId: string, meta: { [key: string]: any }) {
        this.userId = userId;
        this.meta = meta;
    }

    //
    // Static methods
    //
    public static async create(user: CreateUserParams = {}, options: WarrantRequestOptions = {}): Promise<User> {
        try {
            const response = await ObjectModule.create({
                objectType: ObjectType.User,
                objectId: user.userId,
                meta: user.meta,
            }, options);

            return new User(response.objectId, response.meta);
        } catch (e) {
            throw e;
        }
    }

    public static async batchCreate(users: CreateUserParams[], options: WarrantRequestOptions = {}): Promise<User[]> {
        try {
            const objects = users.map((user: CreateUserParams) => { return { objectType: ObjectType.User, objectId: user.userId, meta: user.meta } })
            const response = await ObjectModule.batchCreate(objects, options)

            return response.map((object: WarrantObjectLiteral) => new User(object.objectId, object.meta));
        } catch (e) {
            throw e;
        }
    }

    public static async get(userId: string, options: WarrantRequestOptions = {}): Promise<User> {
        try {
            const response = await ObjectModule.get(ObjectType.User, userId, options)

            return new User(response.objectId, response.meta);
        } catch (e) {
            throw e;
        }
    }

    public static async update(userId: string, meta: { [key: string]: any }, options: WarrantRequestOptions = {}): Promise<User> {
        try {
            const response = await ObjectModule.update(ObjectType.User, userId, meta, options)

            return new User(response.objectId, response.meta);
        } catch (e) {
            throw e;
        }
    }

    public static async delete(userId: string, options: WarrantRequestOptions = {}): Promise<void> {
        return await ObjectModule.delete(ObjectType.User, userId, options);
    }

    public static async batchDelete(users: DeleteUserParams[], options: WarrantRequestOptions = {}): Promise<void> {
        try {
            const objects = users.map((user: DeleteUserParams) => { return { objectType: ObjectType.User, objectId: user.userId } })
            return await ObjectModule.batchDelete(objects, options);
        } catch (e) {
            throw e;
        }
    }

    public static async listUsers(listOptions: ListUserOptions = {}, options: WarrantRequestOptions = {}): Promise<ListUsersResult> {
        try {
            const response = await ObjectModule.list({
                objectType: ObjectType.User,
                ...listOptions,
            }, options);

            const users: User[] = response.results.map((object: WarrantObjectLiteral) => new User(object.objectId, object.meta));
            return {
                ...response,
                results: users,
            };
        } catch (e) {
            throw e;
        }
    }

    public static async listUsersForTenant(tenantId: string, listOptions: ListUserOptions = {}, options: WarrantRequestOptions = {}): Promise<ListUsersResult> {
        try {
            const queryResponse = await WarrantModule.query(`select * of type user for tenant:${tenantId}`, listOptions, options);
            const users: User[] = queryResponse.results.map((queryResult: QueryResult) => new User(queryResult.objectId, queryResult.meta));

            return {
                ...queryResponse,
                results: users,
            };
        } catch (e) {
            throw e;
        }
    }

    public static async assignUserToTenant(tenantId: string, userId: string, role: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
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

    public static async removeUserFromTenant(tenantId: string, userId: string, role: string, options: WarrantRequestOptions = {}): Promise<void> {
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
    public async listTenants(listOptions: ListTenantOptions = {}, options: WarrantRequestOptions = {}): Promise<ListTenantsResult> {
        return Tenant.listTenantsForUser(this.userId, listOptions, options);
    }

    public async listRoles(listOptions: ListRoleOptions = {}, options: WarrantRequestOptions = {}): Promise<ListRolesResult> {
        return Role.listRolesForUser(this.userId, listOptions, options);
    }

    public async assignRole(roleId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return Role.assignRoleToUser(this.userId, roleId, options);
    }

    public async removeRole(roleId: string, options: WarrantRequestOptions = {}): Promise<void> {
        return Role.removeRoleFromUser(this.userId, roleId, options);
    }

    public async listPermissions(listOptions: ListPermissionOptions = {}, options: WarrantRequestOptions = {}): Promise<ListPermissionsResult> {
        return Permission.listPermissionsForUser(this.userId, listOptions, options);
    }

    public async assignPermission(permissionId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return Permission.assignPermissionToUser(this.userId, permissionId, options);
    }

    public async removePermission(permissionId: string, options: WarrantRequestOptions = {}): Promise<void> {
        return Permission.removePermissionFromUser(this.userId, permissionId, options);
    }

    public async hasPermission(permissionId: string, context: PolicyContext = {}, options: WarrantRequestOptions = {}): Promise<boolean> {
        return Authorization.hasPermission({ permissionId: permissionId, subject: { objectType: ObjectType.User, objectId: this.userId }, context: context }, options);
    }

    public async listPricingTiers(listOptions: ListPricingTierOptions = {}, options: WarrantRequestOptions = {}): Promise<ListPricingTiersResult> {
        return PricingTier.listPricingTiersForUser(this.userId, listOptions, options);
    }

    public async assignPricingTier(pricingTierId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return PricingTier.assignPricingTierToUser(this.userId, pricingTierId, options);
    }

    public async removePricingTier(pricingTierId: string, options: WarrantRequestOptions = {}): Promise<void> {
        return PricingTier.removePricingTierFromUser(this.userId, pricingTierId, options);
    }

    public async listFeatures(listOptions: ListFeatureOptions = {}, options: WarrantRequestOptions = {}): Promise<ListFeaturesResult> {
        return Feature.listFeaturesForUser(this.userId, listOptions, options);
    }

    public async assignFeature(featureId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return Feature.assignFeatureToUser(this.userId, featureId, options);
    }

    public async removeFeature(featureId: string, options: WarrantRequestOptions = {}): Promise<void> {
        return Feature.removeFeatureFromUser(this.userId, featureId, options);
    }

    public async hasFeature(featureId: string, context: PolicyContext = {}, options: WarrantRequestOptions = {}): Promise<boolean> {
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
