import WarrantClient from "../WarrantClient";
import { CreatePermissionParams, ListPermissionOptions, UpdatePermissionParams } from "../types/Permission";
import { ObjectType } from "../types/ObjectType";
import { WarrantObject } from "../types/Warrant";

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
        return WarrantClient.httpClient
            .post({
                url: "/v1/permissions",
                data: permission,
            })
            .then((res) => new Permission(res.permissionId, res.name, res.description))
            .catch((e) => {
                throw e;
            });
    }

    public static async get(permissionId: string): Promise<Permission> {
        return WarrantClient.httpClient
            .get({
                url: `/v1/permissions/${permissionId}`,
            })
            .then((res) => new Permission(res.permissionId, res.name, res.description))
            .catch((e) => {
                throw e;
            });
    }

    public static async update(permissionId: string, permission: UpdatePermissionParams): Promise<Permission> {
        return WarrantClient.httpClient
            .put({
                url: `/v1/permissions/${permissionId}`,
                data: permission,
            })
            .then((res) => new Permission(res.permissionId, res.name, res.description))
            .catch((e) => {
                throw e;
            });
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
        return WarrantClient.httpClient
            .get({
                url: "/v1/permissions",
                params: listOptions,
            })
            .then((res) => res.map((permission: Permission) => new Permission(permission.permissionId, permission.name, permission.description)))
            .catch((e) => {
                throw e;
            });
    }

    public static async listPermissionsForUser(userId: string, listOptions: ListPermissionOptions = {}): Promise<Permission[]> {
        return WarrantClient.httpClient
            .get({
                url: `/v1/users/${userId}/permissions`,
                params: listOptions,
            })
            .then((res) => res.map((permission: Permission) => new Permission(permission.permissionId, permission.name, permission.description)))
            .catch((e) => {
                throw e;
            });
    }

    public static async assignPermissionToUser(userId: string, permissionId: string): Promise<Permission> {
        return WarrantClient.httpClient
            .post({
                url: `/v1/users/${userId}/permissions/${permissionId}`,
            })
            .then((res) => new Permission(res.permissionId, res.name, res.description))
            .catch((e) => {
                throw e;
            });
    }

    public static async removePermissionFromUser(userId: string, permissionId: string): Promise<void> {
        try {
            await WarrantClient.httpClient.delete({
                url: `/v1/users/${userId}/permissions/${permissionId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async listPermissionsForRole(roleId: string, listOptions: ListPermissionOptions = {}): Promise<Permission[]> {
        return WarrantClient.httpClient
            .get({
                url: `/v1/roles/${roleId}/permissions`,
                params: listOptions,
            })
            .then((res) => res.map((permission: Permission) => new Permission(permission.permissionId, permission.name, permission.description)))
            .catch((e) => {
                throw e;
            });
    }

    public static async assignPermissionToRole(roleId: string, permissionId: string): Promise<Permission> {
        return WarrantClient.httpClient
            .post({
                url: `/v1/roles/${roleId}/permissions/${permissionId}`,
            })
            .then((res) => new Permission(res.permissionId, res.name, res.description))
            .catch((e) => {
                throw e;
            });
    }

    public static async removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
        try {
            await WarrantClient.httpClient.delete({
                url: `/v1/roles/${roleId}/permissions/${permissionId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    // WarrantObject methods
    public getObjectType(): string {
        return ObjectType.Permission;
    }

    public getObjectId(): string {
        return this.permissionId;
    }
}
