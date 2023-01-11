import Authorization from "./Authorization";
import Permission from "./Permission";
import WarrantClient from "../WarrantClient";
import { ObjectType } from "../types/ObjectType";
import { ListPermissionOptions } from "../types/Permission";
import { CreateRoleParams, ListRoleOptions, UpdateRoleParams } from "../types/Role";
import { Context, WarrantObject } from "../types/Warrant";

export default class Role implements WarrantObject {
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
        return WarrantClient.httpClient
            .post({
                url: "/v1/roles",
                data: role,
            })
            .then((res) => new Role(res.roleId, res.name, res.description))
            .catch((e) => {
                throw e;
            });
    }

    public static async get(roleId: string): Promise<Role> {
        return WarrantClient.httpClient
            .get({
                url: `/v1/roles/${roleId}`,
            })
            .then((res) => new Role(res.roleId, res.name, res.description))
            .catch((e) => {
                throw e;
            });
    }

    public static async update(roleId: string, role: UpdateRoleParams): Promise<Role> {
        return WarrantClient.httpClient
            .put({
                url: `/v1/roles/${roleId}`,
                data: role,
            })
            .then((res) => new Role(res.roleId, res.name, res.description))
            .catch((e) => {
                throw e;
            });;
    }

    public static async delete(roleId: string): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/roles/${roleId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async listRoles(listOptions: ListRoleOptions = {}): Promise<Role[]> {
        return WarrantClient.httpClient
            .get({
                url: "/v1/roles",
                params: listOptions,
            })
            .then((res) => res.map((role: Role) => new Role(role.roleId, role.name, role.description)))
            .catch((e) => {
                throw e;
            });
    }

    public static async listRolesForUser(userId: string, listOptions: ListRoleOptions = {}): Promise<Role[]> {
        return WarrantClient.httpClient
            .get({
                url: `/v1/users/${userId}/roles`,
                params: listOptions,
            })
            .then((res) => res.map((role: Role) => new Role(role.roleId, role.name, role.description)))
            .catch((e) => {
                throw e;
            });
    }

    public static async assignRoleToUser(userId: string, roleId: string): Promise<Role> {
        return WarrantClient.httpClient
            .post({
                url: `/v1/users/${userId}/roles/${roleId}`,
            })
            .then((res) => new Role(res.roleId, res.name, res.description))
            .catch((e) => {
                throw e;
            });;
    }

    public static async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
        try {
            await WarrantClient.httpClient.delete({
                url: `/v1/users/${userId}/roles/${roleId}`,
            });
        } catch (e) {
            throw e;
        }
    }

    // Instance methods
    public async listPermissions(listOptions: ListPermissionOptions = {}): Promise<Permission[]> {
        return Permission.listPermissionsForRole(this.roleId, listOptions);
    }

    public async assignPermission(permissionId: string): Promise<Permission> {
        return Permission.assignPermissionToRole(this.roleId, permissionId);
    }

    public async removePermission(permissionId: string): Promise<void> {
        return Permission.removePermissionFromRole(this.roleId, permissionId);
    }

    public async hasPermission(permissionId: string, context: Context = {}): Promise<boolean> {
        return Authorization.hasPermission({ permissionId: permissionId, subject: { objectType: ObjectType.Role, objectId: this.roleId }, context: context });
    }

    // WarrantObject methods
    public getObjectType(): string {
        return ObjectType.Role;
    }

    public getObjectId(): string {
        return this.roleId;
    }
}
