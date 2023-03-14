import WarrantModule from "./WarrantModule";
import WarrantClient from "../WarrantClient";
import { CreatePermissionParams, ListPermissionOptions, UpdatePermissionParams } from "../types/Permission";
import { ObjectType } from "../types/ObjectType";
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
    public static async create(permission: CreatePermissionParams): Promise<Permission> {
        try {
            const response = await WarrantClient.httpClient.post({
                url: "/v1/permissions",
                data: permission,
            });

            return new Permission(response.permissionId, response.name, response.description);
        } catch (e) {
            throw e;
        }
    }

    public static async get(permissionId: string): Promise<Permission> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/permissions/${permissionId}`,
            });

            return new Permission(response.permissionId, response.name, response.description);
        } catch (e) {
            throw e;
        }
    }

    public static async update(permissionId: string, permission: UpdatePermissionParams): Promise<Permission> {
        try {
            const response = await WarrantClient.httpClient.put({
                url: `/v1/permissions/${permissionId}`,
                data: permission,
            });

            return new Permission(response.permissionId, response.name, response.description);
        } catch (e) {
            throw e;
        }
    }

    public static async delete(permissionId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/permissions/${permissionId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async listPermissions(listOptions: ListPermissionOptions = {}): Promise<Permission[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: "/v1/permissions",
                params: listOptions,
            });

            return response.map((permission: Permission) => new Permission(permission.permissionId, permission.name, permission.description));
        } catch (e) {
            throw e;
        }
    }

    public static async listPermissionsForUser(userId: string, listOptions: ListPermissionOptions = {}): Promise<Permission[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/users/${userId}/permissions`,
                params: listOptions,
            });

            return response.map((permission: Permission) => new Permission(permission.permissionId, permission.name, permission.description));
        } catch (e) {
            throw e;
        }
    }

    public static async assignPermissionToUser(userId: string, permissionId: string): Promise<Warrant> {
        return WarrantModule.create({
            object: {
                objectType: "permission",
                objectId: permissionId,
            },
            relation: "member",
            subject: {
                objectType: "user",
                objectId: userId,
            }
        });
    }

    public static async removePermissionFromUser(userId: string, permissionId: string): Promise<void> {
        return WarrantModule.delete({
            object: {
                objectType: "permission",
                objectId: permissionId,
            },
            relation: "member",
            subject: {
                objectType: "user",
                objectId: userId,
            }
        });
    }

    public static async listPermissionsForRole(roleId: string, listOptions: ListPermissionOptions = {}): Promise<Permission[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/roles/${roleId}/permissions`,
                params: listOptions,
            });

            return response.map((permission: Permission) => new Permission(permission.permissionId, permission.name, permission.description));
        } catch (e) {
            throw e;
        }
    }

    public static async assignPermissionToRole(roleId: string, permissionId: string): Promise<Warrant> {
        return WarrantModule.create({
            object: {
                objectType: "permission",
                objectId: permissionId,
            },
            relation: "member",
            subject: {
                objectType: "role",
                objectId: roleId,
            }
        });
    }

    public static async removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
        return WarrantModule.delete({
            object: {
                objectType: "permission",
                objectId: permissionId,
            },
            relation: "member",
            subject: {
                objectType: "role",
                objectId: roleId,
            }
        });
    }

    // WarrantObject methods
    public getObjectType(): string {
        return ObjectType.Permission;
    }

    public getObjectId(): string {
        return this.permissionId;
    }
}
