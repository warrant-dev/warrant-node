import WarrantModule from "./WarrantModule";
import WarrantClient from "../WarrantClient";
import { CreatePermissionParams, ListPermissionOptions, UpdatePermissionParams } from "../types/Permission";
import { ObjectType } from "../types/ObjectType";
import { UserRequestOptions } from "../types/Params";
import Warrant, { WarrantObject } from "../types/Warrant";

export default class Permission implements WarrantObject {
    permissionId: string;
    name?: string;
    description?: string;

    constructor(permissionId: string, name?: string, description?: string) {
        this.permissionId = permissionId;
        this.name = name;
        this.description = description;
    }

    //
    // Static methods
    //
    public static async create(permission: CreatePermissionParams, options: UserRequestOptions = {}): Promise<Permission> {
        try {
            const response = await WarrantClient.httpClient.post({
                url: "/v1/permissions",
                data: permission,
                options,
            });

            return new Permission(response.permissionId, response.name, response.description);
        } catch (e) {
            throw e;
        }
    }

    public static async get(permissionId: string, options: UserRequestOptions = {}): Promise<Permission> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/permissions/${permissionId}`,
                options,
            });

            return new Permission(response.permissionId, response.name, response.description);
        } catch (e) {
            throw e;
        }
    }

    public static async update(permissionId: string, permission: UpdatePermissionParams, options: UserRequestOptions = {}): Promise<Permission> {
        try {
            const response = await WarrantClient.httpClient.put({
                url: `/v1/permissions/${permissionId}`,
                data: permission,
                options,
            });

            return new Permission(response.permissionId, response.name, response.description);
        } catch (e) {
            throw e;
        }
    }

    public static async delete(permissionId: string, options: UserRequestOptions = {}): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/permissions/${permissionId}`,
                options,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async listPermissions(listOptions: ListPermissionOptions = {}, options: UserRequestOptions = {}): Promise<Permission[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: "/v1/permissions",
                params: listOptions,
                options,
            });

            return response.map((permission: Permission) => new Permission(permission.permissionId, permission.name, permission.description));
        } catch (e) {
            throw e;
        }
    }

    public static async listPermissionsForUser(userId: string, listOptions: ListPermissionOptions = {}, options: UserRequestOptions = {}): Promise<Permission[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/users/${userId}/permissions`,
                params: listOptions,
                options,
            });

            return response.map((permission: Permission) => new Permission(permission.permissionId, permission.name, permission.description));
        } catch (e) {
            throw e;
        }
    }

    public static async assignPermissionToUser(userId: string, permissionId: string, options: UserRequestOptions = {}): Promise<Warrant> {
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

    public static async removePermissionFromUser(userId: string, permissionId: string, options: UserRequestOptions = {}): Promise<void> {
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

    public static async listPermissionsForRole(roleId: string, listOptions: ListPermissionOptions = {}, options: UserRequestOptions = {}): Promise<Permission[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/roles/${roleId}/permissions`,
                params: listOptions,
                options,
            });

            return response.map((permission: Permission) => new Permission(permission.permissionId, permission.name, permission.description));
        } catch (e) {
            throw e;
        }
    }

    public static async assignPermissionToRole(roleId: string, permissionId: string, options: UserRequestOptions = {}): Promise<Warrant> {
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

    public static async removePermissionFromRole(roleId: string, permissionId: string, options: UserRequestOptions = {}): Promise<void> {
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
