import ObjectModule from "./ObjectModule";
import WarrantModule from "./WarrantModule";
import { ListResponse } from "../types/List";
import { WarrantObject, WarrantObjectLiteral } from "../types/Object";
import { ObjectType } from "../types/ObjectType";
import { CreatePermissionParams, ListPermissionOptions } from "../types/Permission";
import { QueryResult } from "../types/Query";
import Warrant from "../types/Warrant";
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
                objectType: ObjectType.Permission,
                objectId: permission.permissionId,
                meta: permission.meta,
            }, options);

            return new Permission(response.objectId, response.meta);
        } catch (e) {
            throw e;
        }
    }

    public static async get(permissionId: string, options: WarrantRequestOptions = {}): Promise<Permission> {
        try {
            const response = await ObjectModule.get(ObjectType.Permission, permissionId, options);

            return new Permission(response.objectId, response.meta);
        } catch (e) {
            throw e;
        }
    }

    public static async update(permissionId: string, meta: { [key: string]: any }, options: WarrantRequestOptions = {}): Promise<Permission> {
        try {
            const response = await ObjectModule.update(ObjectType.Permission, permissionId, meta, options);

            return new Permission(response.objectId, response.meta);
        } catch (e) {
            throw e;
        }
    }

    public static async delete(permissionId: string, options: WarrantRequestOptions = {}): Promise<string> {
        return await ObjectModule.delete(ObjectType.Permission, permissionId, options);
    }

    public static async listPermissions(listOptions: ListPermissionOptions = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Permission>> {
        try {
            const response = await ObjectModule.list({
                objectType: ObjectType.Permission,
                ...listOptions,
            }, options);

            const permissions: Permission[] = response.results.map((object: WarrantObjectLiteral) => new Permission(object.objectId, object.meta));
            return {
                ...response,
                results: permissions,
            };
        } catch (e) {
            throw e;
        }
    }

    public static async listPermissionsForUser(userId: string, listOptions: ListPermissionOptions = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Permission>> {
        try {
            const queryResponse = await WarrantModule.query(`select permission where user:${userId} is *`, listOptions, options);
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

    public static async listPermissionsForRole(roleId: string, listOptions: ListPermissionOptions = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Permission>> {
        try {
            const queryResponse = await WarrantModule.query(`select permission where role:${roleId} is *`, listOptions, options);
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
