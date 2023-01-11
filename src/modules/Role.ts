import Authorization from "./Authorization";
import Permission from "./Permission";
import WarrantClient from "../WarrantClient";
import { ObjectType } from "../types/ObjectType";
import { ListPermissionOptions } from "../types/Permission";
import { CreateRoleParams, ListRoleOptions, UpdateRoleParams } from "../types/Role";
import { Context } from "../types/Warrant";

export default class Role {
    roleId: string;
    name?: string;
    description?: string;

    constructor(roleId: string, name?: string, description?: string) {
        this.roleId = roleId;
        this.name = name;
        this.description = description;
    }

    //
    // Static methods
    //
    public static async create(role: CreateRoleParams): Promise<Role> {
        try {
            return await WarrantClient.httpClient.post({
                url: "/v1/roles",
                data: role,
            });
        } catch (e) {
            console.log("Error creating role");
            throw e;
        }
    }

    public static async get(roleId: string): Promise<Role> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/roles/${roleId}`,
            });
        } catch (e) {
            console.log("Error getting role");
            throw e;
        }
    }

    public static async update(roleId: string, role: UpdateRoleParams): Promise<Role> {
        try {
            return await WarrantClient.httpClient.put({
                url: `/v1/roles/${roleId}`,
                data: role,
            });
        } catch (e) {
            console.log("Error updating role");
            throw e;
        }
    }

    public static async delete(roleId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/roles/${roleId}`,
            });
        } catch (e) {
            console.log("Error deleting role");
            throw e;
        }
    }

    public static async listRoles(listOptions: ListRoleOptions = {}): Promise<Role[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: "/v1/roles",
                params: listOptions,
            });
        } catch (e) {
            console.log("Error listing roles");
            throw e;
        }
    }

    public static async listRolesForUser(userId: string, listOptions: ListRoleOptions = {}): Promise<Role[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/users/${userId}/roles`,
                params: listOptions,
            });
        } catch (e) {
            console.log("Error listing roles for user");
            throw e;
        }
    }

    public static async assignRoleToUser(userId: string, roleId: string): Promise<Role> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/users/${userId}/roles/${roleId}`,
            });
        } catch (e) {
            console.log("Error assigning role to user");
            throw e;
        }
    }

    public static async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
        try {
            await WarrantClient.httpClient.delete({
                url: `/v1/users/${userId}/roles/${roleId}`,
            });
        } catch (e) {
            console.log("Error removing role from user");
            throw e;
        }
    }

    // Instance methods
    public async listPermissions(listOptions: ListPermissionOptions = {}): Promise<Permission[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/v1/roles/${this.roleId}/permissions`,
                params: listOptions,
            });
        } catch (e) {
            console.log("Error listing permissions for role");
            throw e;
        }
    }

    public async assignPermission(permissionId: string): Promise<Permission> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/v1/roles/${this.roleId}/permissions/${permissionId}`,
            });
        } catch (e) {
            console.log("Error assigning permission to role");
            throw e;
        }
    }

    public async removePermission(permissionId: string): Promise<void> {
        try {
            await WarrantClient.httpClient.delete({
                url: `/v1/roles/${this.roleId}/permissions/${permissionId}`,
            });
        } catch (e) {
            console.log("Error removing permission from role");
            throw e;
        }
    }

    public async hasPermission(permissionId: string, context: Context = {}): Promise<boolean> {
        return Authorization.hasPermission({ permissionId: permissionId, subject: { objectType: ObjectType.Role, objectId: this.roleId }, context: context });
    }
}
