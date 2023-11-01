import {
    ListFeatureParams,
    ListResponse,
    WarrantObject,
    BaseWarrantObject,
    ListPermissionParams,
    ListPricingTierParams,
    QueryResult,
    ListRoleParams,
    CreateUserParams,
    DeleteUserParams,
    GetUserParams,
    ListUserParams,
    UpdateUserParams,
    ListTenantParams,
    Warrant,
    PermissionCheckParams,
    FeatureCheckParams,
} from "../types";
import Authorization from "./Authorization";
import Feature from "./Feature";
import ObjectModule from "./ObjectModule";
import Permission from "./Permission";
import PricingTier from "./PricingTier";
import Role from "./Role";
import Tenant from "./Tenant";
import WarrantModule from "./WarrantModule";
import { ObjectType } from "../types/ObjectType";
import { WarrantRequestOptions } from "../types/WarrantRequestOptions";


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
    public static async create(params: CreateUserParams = {}, options: WarrantRequestOptions = {}): Promise<User> {
        const response = await ObjectModule.create({
            object: {
                objectType: ObjectType.User,
                objectId: params.userId,
            },
            meta: params.meta,
        }, options);

        return new User(response.objectId, response.meta);
    }

    public static async batchCreate(params: CreateUserParams[], options: WarrantRequestOptions = {}): Promise<User[]> {
        const response = await ObjectModule.batchCreate(params.map((user: CreateUserParams) => ({
            object: {
                objectType: ObjectType.User,
                objectId: user.userId,
            },
            meta: user.meta,
        } )), options);

        return response.map((object: BaseWarrantObject) => new User(object.objectId, object.meta));
    }

    public static async get(params: GetUserParams, options: WarrantRequestOptions = {}): Promise<User> {
        const response = await ObjectModule.get({
            object: {
                objectType: ObjectType.User,
                objectId: params.userId,
            },
        }, options)

        return new User(response.objectId, response.meta);
    }

    public static async update(params: UpdateUserParams, options: WarrantRequestOptions = {}): Promise<User> {
        const response = await ObjectModule.update({
            object: {
                objectType: ObjectType.User,
                objectId: params.userId,
            },
            meta: params.meta,
        }, options);

        return new User(response.objectId, response.meta);
    }

    public static async delete(params: DeleteUserParams, options: WarrantRequestOptions = {}): Promise<string> {
    return ObjectModule.delete({
        object: {
            objectType: ObjectType.User,
            objectId: params.userId,
        },
    }, options);
    }

    public static async batchDelete(params: DeleteUserParams[], options: WarrantRequestOptions = {}): Promise<string> {
        return await ObjectModule.batchDelete(params.map((user: DeleteUserParams) => ({
            object: {
                objectType: ObjectType.User,
                objectId: user.userId,
            },
        })), options);
    }

    public static async listUsers(listParams: ListUserParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<User>> {
        const response = await ObjectModule.list({
            objectType: ObjectType.User,
            ...listParams,
        }, options);

        const users: User[] = response.results.map((object: BaseWarrantObject) => new User(object.objectId, object.meta));
        return {
            ...response,
            results: users,
        };
    }

    public static async listUsersForTenant(tenantId: string, listParams: ListUserParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<User>> {
        const queryResponse = await WarrantModule.query(`select * of type user for tenant:${tenantId}`, listParams, options);
        const users: User[] = queryResponse.results.map((queryResult: QueryResult) => new User(queryResult.objectId, queryResult.meta));

        return {
            ...queryResponse,
            results: users,
        };
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

    public static async removeUserFromTenant(tenantId: string, userId: string, role: string, options: WarrantRequestOptions = {}): Promise<string> {
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
    public async listTenants(listParams: ListTenantParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Tenant>> {
        return Tenant.listTenantsForUser(this.userId, listParams, options);
    }

    public async listRoles(listParams: ListRoleParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Role>> {
        return Role.listRolesForUser(this.userId, listParams, options);
    }

    public async assignRole(roleId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return Role.assignRoleToUser(this.userId, roleId, options);
    }

    public async removeRole(roleId: string, options: WarrantRequestOptions = {}): Promise<string> {
        return Role.removeRoleFromUser(this.userId, roleId, options);
    }

    public async listPermissions(listParams: ListPermissionParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Permission>> {
        return Permission.listPermissionsForUser(this.userId, listParams, options);
    }

    public async assignPermission(permissionId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return Permission.assignPermissionToUser(this.userId, permissionId, options);
    }

    public async removePermission(permissionId: string, options: WarrantRequestOptions = {}): Promise<string> {
        return Permission.removePermissionFromUser(this.userId, permissionId, options);
    }

    public async hasPermission(params: PermissionCheckParams, options: WarrantRequestOptions = {}): Promise<boolean> {
        return Authorization.hasPermission({ permissionId: params.permissionId, subject: { objectType: ObjectType.User, objectId: this.userId }, context: params.context }, options);
    }

    public async listPricingTiers(listParams: ListPricingTierParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<PricingTier>> {
        return PricingTier.listPricingTiersForUser(this.userId, listParams, options);
    }

    public async assignPricingTier(pricingTierId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return PricingTier.assignPricingTierToUser(this.userId, pricingTierId, options);
    }

    public async removePricingTier(pricingTierId: string, options: WarrantRequestOptions = {}): Promise<string> {
        return PricingTier.removePricingTierFromUser(this.userId, pricingTierId, options);
    }

    public async listFeatures(listParams: ListFeatureParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Feature>> {
        return Feature.listFeaturesForUser(this.userId, listParams, options);
    }

    public async assignFeature(featureId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return Feature.assignFeatureToUser(this.userId, featureId, options);
    }

    public async removeFeature(featureId: string, options: WarrantRequestOptions = {}): Promise<string> {
        return Feature.removeFeatureFromUser(this.userId, featureId, options);
    }

    public async hasFeature(params: FeatureCheckParams, options: WarrantRequestOptions = {}): Promise<boolean> {
        return Authorization.hasFeature({ featureId: params.featureId, subject: { objectType: ObjectType.User, objectId: this.userId }, context: params.context }, options);
    }

    // WarrantObject methods
    public getObjectType(): string {
        return ObjectType.User;
    }

    public getObjectId(): string {
        return this.userId;
    }
}
