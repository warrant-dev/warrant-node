import Authorization from "./Authorization";
import Permission from "./Permission";
import WarrantModule from "./WarrantModule";
import WarrantClient from "../WarrantClient";
import { ObjectType } from "../types/ObjectType";
import { ListPermissionOptions } from "../types/Permission";
import { CreateRoleParams, ListRoleOptions, UpdateRoleParams } from "../types/Role";
import Warrant, { PolicyContext, WarrantObject } from "../types/Warrant";

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
        try {
            const response = await WarrantClient.httpClient.post({
                url: "/v1/roles",
                data: role,
            });

            return new Role(response.roleId, response.name, response.description);
        } catch (e) {
            throw e;
        }
    }

    public static async get(roleId: string): Promise<Role> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/roles/${roleId}`,
            });

            return new Role(response.roleId, response.name, response.description);
        } catch (e) {
            throw e;
        }
    }

    public static async update(roleId: string, role: UpdateRoleParams): Promise<Role> {
        try {
            const response = await WarrantClient.httpClient.put({
                url: `/v1/roles/${roleId}`,
                data: role,
            });

            return new Role(response.roleId, response.name, response.description);
        } catch (e) {
            throw e;
        }
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
        try {
            const response = await WarrantClient.httpClient.get({
                url: "/v1/roles",
                params: listOptions,
            });

            return response.map((role: Role) => new Role(role.roleId, role.name, role.description));
        } catch (e) {
            throw e;
        }
    }

    public static async listRolesForUser(userId: string, listOptions: ListRoleOptions = {}): Promise<Role[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/users/${userId}/roles`,
                params: listOptions,
            });

            return response.map((role: Role) => new Role(role.roleId, role.name, role.description));
        } catch (e) {
            throw e;
        }
    }

    public static async assignRoleToUser(userId: string, roleId: string): Promise<Warrant> {
        return WarrantModule.create({
            object: {
                objectType: ObjectType.Role,
                objectId: roleId,
            },
            relation: "member",
            subject: {
                objectType: ObjectType.User,
                objectId: userId,
            }
        });
    }

    public static async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
        return WarrantModule.delete({
            object: {
                objectType: ObjectType.Role,
                objectId: roleId,
            },
            relation: "member",
            subject: {
                objectType: ObjectType.User,
                objectId: userId,
            }
        });
    }

    // Instance methods
    public async listPermissions(listOptions: ListPermissionOptions = {}): Promise<Permission[]> {
        return Permission.listPermissionsForRole(this.roleId, listOptions);
    }

    public async assignPermission(permissionId: string): Promise<Warrant> {
        return Permission.assignPermissionToRole(this.roleId, permissionId);
    }

    public async removePermission(permissionId: string): Promise<void> {
        return Permission.removePermissionFromRole(this.roleId, permissionId);
    }

    public async hasPermission(permissionId: string, context: PolicyContext = {}): Promise<boolean> {
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
