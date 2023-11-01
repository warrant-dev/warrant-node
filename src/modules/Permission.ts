import {
    CreatePermissionParams,
    ListPermissionParams,
    UpdatePermissionParams,
    ListResponse,
    WarrantObject,
    BaseWarrantObject,
    Warrant,
    QueryResult
} from "../types";
import ObjectModule from "./ObjectModule";
import WarrantModule from "./WarrantModule";
import { ObjectType } from "../types/ObjectType";
import { WarrantRequestOptions } from "../types/WarrantRequestOptions";


export default class Permission implements WarrantObject {
    permissionId: string;
    meta?: { [key: string]: any }

    constructor(permissionId: string, meta: { [key: string]: any }) {
        this.permissionId = permissionId;
        this.meta = meta;
    }

    //
    // Static methods
    //
    public static async create(permission: CreatePermissionParams = {}, options: WarrantRequestOptions = {}): Promise<Permission> {
        try {
            const response = await ObjectModule.create({
                object: {
                    objectType: ObjectType.Permission,
                    objectId: permission.permissionId,
                },
                meta: permission.meta,
            }, options);

            return new Permission(response.objectId, response.meta);
        } catch (e) {
            throw e;
        }
    }

    public static async get(permissionId: string, options: WarrantRequestOptions = {}): Promise<Permission> {
        try {
            const response = await ObjectModule.get({
                objectType: ObjectType.Permission,
                objectId: permissionId,
            }, options);

            return new Permission(response.objectId, response.meta);
        } catch (e) {
            throw e;
        }
    }

    public static async update(permissionId: string, params: UpdatePermissionParams, options: WarrantRequestOptions = {}): Promise<Permission> {
        try {
            const response = await ObjectModule.update({
                objectType: ObjectType.Permission,
                objectId: permissionId,
            }, { meta: params.meta }, options);

            return new Permission(response.objectId, response.meta);
        } catch (e) {
            throw e;
        }
    }

    public static async delete(permissionId: string, options: WarrantRequestOptions = {}): Promise<string> {
        return ObjectModule.delete({
            objectType: ObjectType.Permission,
            objectId: permissionId,
        }, options);
    }

    public static async listPermissions(listParams: ListPermissionParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Permission>> {
        try {
            const response = await ObjectModule.list({
                objectType: ObjectType.Permission,
                ...listParams,
            }, options);

            const permissions: Permission[] = response.results.map((object: BaseWarrantObject) => new Permission(object.objectId, object.meta));
            return {
                ...response,
                results: permissions,
            };
        } catch (e) {
            throw e;
        }
    }

    public static async listPermissionsForUser(userId: string, listParams: ListPermissionParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Permission>> {
        try {
            const queryResponse = await WarrantModule.query(`select permission where user:${userId} is *`, listParams, options);
            const permissions: Permission[] = queryResponse.results.map((queryResult: QueryResult) => new Permission(queryResult.objectId, queryResult.meta));

            return {
                ...queryResponse,
                results: permissions,
            };
        } catch (e) {
            throw e;
        }
    }

    public static async assignPermissionToUser(userId: string, permissionId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return WarrantModule.create({
            object: {
                objectType: ObjectType.Permission,
                objectId: permissionId,
            },
            relation: "member",
            subject: {
                objectType: ObjectType.User,
                objectId: userId,
            }
        }, options);
    }

    public static async removePermissionFromUser(userId: string, permissionId: string, options: WarrantRequestOptions = {}): Promise<string> {
        return WarrantModule.delete({
            object: {
                objectType: ObjectType.Permission,
                objectId: permissionId,
            },
            relation: "member",
            subject: {
                objectType: ObjectType.User,
                objectId: userId,
            }
        }, options);
    }

    public static async listPermissionsForRole(roleId: string, listParams: ListPermissionParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Permission>> {
        try {
            const queryResponse = await WarrantModule.query(`select permission where role:${roleId} is *`, listParams, options);
            const permissions: Permission[] = queryResponse.results.map((queryResult: QueryResult) => new Permission(queryResult.objectId, queryResult.meta));

            return {
                ...queryResponse,
                results: permissions,
            };
        } catch (e) {
            throw e;
        }
    }

    public static async assignPermissionToRole(roleId: string, permissionId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return WarrantModule.create({
            object: {
                objectType: ObjectType.Permission,
                objectId: permissionId,
            },
            relation: "member",
            subject: {
                objectType: ObjectType.Role,
                objectId: roleId,
            }
        }, options);
    }

    public static async removePermissionFromRole(roleId: string, permissionId: string, options: WarrantRequestOptions = {}): Promise<string> {
        return WarrantModule.delete({
            object: {
                objectType: ObjectType.Permission,
                objectId: permissionId,
            },
            relation: "member",
            subject: {
                objectType: ObjectType.Role,
                objectId: roleId,
            }
        }, options);
    }

    // WarrantObject methods
    public getObjectType(): string {
        return ObjectType.Permission;
    }

    public getObjectId(): string {
        return this.permissionId;
    }
}
