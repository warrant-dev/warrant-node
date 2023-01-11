import WarrantClient from "../WarrantClient";
import { CreatePermissionParams, ListPermissionOptions, UpdatePermissionParams } from "../types/Permission";
import { ObjectType } from "../types/ObjectType";
import { WarrantObject } from "../types/Warrant";

export default class Permission implements WarrantObject {
    // WarrantObject properties
    objectType: string = ObjectType.Permission;
    objectId: string;

    // Permission properties
    permissionId: string;
    name?: string;
    description?: string;

    constructor(permissionId: string, name?: string, description?: string) {
        this.objectId = permissionId;
        this.permissionId = permissionId;
        this.name = name;
        this.description = description;
    }

    //
    // Static methods
    //
    public static async create(permission: CreatePermissionParams): Promise<Permission> {
        try {
            return await WarrantClient.httpClient.post({
                url: "/v1/permissions",
                data: permission,
            });
        } catch (e) {
            console.log("Error creating permission");
            throw e;
        }
    }

    public static async get(permissionId: string): Promise<Permission> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/permissions/${permissionId}`,
            });
        } catch (e) {
            console.log("Error getting permission");
            throw e;
        }
    }

    public static async update(permissionId: string, permission: UpdatePermissionParams): Promise<Permission> {
        try {
            return await WarrantClient.httpClient.put({
                url: `/v1/permissions/${permissionId}`,
                data: permission,
            });
        } catch (e) {
            console.log("Error updating permission");
            throw e;
        }
    }

    public static async delete(permissionId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/permissions/${permissionId}`,
            });
        } catch (e) {
            console.log("Error deleting permission");
            throw e;
        }
    }

    public static async listPermissions(listOptions: ListPermissionOptions = {}): Promise<Permission[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: "/v1/permissions",
                params: listOptions,
            });
        } catch (e) {
            console.log("Error listing permissions");
            throw e;
        }
    }

    public static async listPermissionsForUser(userId: string, listOptions: ListPermissionOptions = {}): Promise<Permission[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/users/${userId}/permissions`,
                params: listOptions,
            });
        } catch (e) {
            console.log("Error listing permissions for user");
            throw e;
        }
    }

    public static async assignPermissionToUser(userId: string, permissionId: string): Promise<Permission> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/users/${userId}/permissions/${permissionId}`,
            });
        } catch (e) {
            console.log("Error assigning permission to user");
            throw e;
        }
    }

    public static async removePermissionFromUser(userId: string, permissionId: string): Promise<void> {
        try {
            await WarrantClient.httpClient.delete({
                url: `/v1/users/${userId}/permissions/${permissionId}`,
            });
        } catch (e) {
            console.log("Error removing permission from user");
            throw e;
        }
    }

    public static async listPermissionsForRole(roleId: string, listOptions: ListPermissionOptions = {}): Promise<Permission[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/roles/${roleId}/permissions`,
                params: listOptions,
            });
        } catch (e) {
            console.log("Error listing permissions for role");
            throw e;
        }
    }

    public static async assignPermissionToRole(roleId: string, permissionId: string): Promise<Permission> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/roles/${roleId}/permissions/${permissionId}`,
            });
        } catch (e) {
            console.log("Error assigning permission to role");
            throw e;
        }
    }

    public static async removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
        try {
            await WarrantClient.httpClient.delete({
                url: `/v1/roles/${roleId}/permissions/${permissionId}`,
            });
        } catch (e) {
            console.log("Error removing permission from role");
            throw e;
        }
    }
}
