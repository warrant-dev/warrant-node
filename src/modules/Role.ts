import Authorization from "./Authorization";
import Permission from "./Permission";
import WarrantModule from "./WarrantModule";
import WarrantClient from "../WarrantClient";
import { ObjectType } from "../types/ObjectType";
import { UserRequestOptions } from "../types/Params";
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
    public static async create(role: CreateRoleParams, options: UserRequestOptions = {}): Promise<Role> {
        try {
            const response = await WarrantClient.httpClient.post({
                url: "/v1/roles",
                data: role,
                options,
            });

            return new Role(response.roleId, response.name, response.description);
        } catch (e) {
            throw e;
        }
    }

    public static async get(roleId: string, options: UserRequestOptions = {}): Promise<Role> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/roles/${roleId}`,
                options,
            });

            return new Role(response.roleId, response.name, response.description);
        } catch (e) {
            throw e;
        }
    }

    public static async update(roleId: string, role: UpdateRoleParams, options: UserRequestOptions = {}): Promise<Role> {
        try {
            const response = await WarrantClient.httpClient.put({
                url: `/v1/roles/${roleId}`,
                data: role,
                options,
            });

            return new Role(response.roleId, response.name, response.description);
        } catch (e) {
            throw e;
        }
    }

    public static async delete(roleId: string, options: UserRequestOptions = {}): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/v1/roles/${roleId}`,
                options,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async listRoles(listOptions: ListRoleOptions = {}, options: UserRequestOptions = {}): Promise<Role[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: "/v1/roles",
                params: listOptions,
                options,
            });

            return response.map((role: Role) => new Role(role.roleId, role.name, role.description));
        } catch (e) {
            throw e;
        }
    }

    public static async listRolesForUser(userId: string, listOptions: ListRoleOptions = {}, options: UserRequestOptions = {}): Promise<Role[]> {
        try {
            const response = await WarrantClient.httpClient.get({
                url: `/v1/users/${userId}/roles`,
                params: listOptions,
                options,
            });

            return response.map((role: Role) => new Role(role.roleId, role.name, role.description));
        } catch (e) {
            throw e;
        }
    }

    public static async assignRoleToUser(userId: string, roleId: string, options: UserRequestOptions = {}): Promise<Warrant> {
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
        }, options);
    }

    public static async removeRoleFromUser(userId: string, roleId: string, options: UserRequestOptions = {}): Promise<void> {
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
        }, options);
    }

    // Instance methods
    public async listPermissions(listOptions: ListPermissionOptions = {}, options: UserRequestOptions = {}): Promise<Permission[]> {
        return Permission.listPermissionsForRole(this.roleId, listOptions, options);
    }

    public async assignPermission(permissionId: string, options: UserRequestOptions = {}): Promise<Warrant> {
        return Permission.assignPermissionToRole(this.roleId, permissionId, options);
    }

    public async removePermission(permissionId: string, options: UserRequestOptions = {}): Promise<void> {
        return Permission.removePermissionFromRole(this.roleId, permissionId, options);
    }

    public async hasPermission(permissionId: string, context: PolicyContext = {}, options: UserRequestOptions = {}): Promise<boolean> {
        return Authorization.hasPermission({ permissionId: permissionId, subject: { objectType: ObjectType.Role, objectId: this.roleId }, context: context }, options);
    }

    // WarrantObject methods
    public getObjectType(): string {
        return ObjectType.Role;
    }

    public getObjectId(): string {
        return this.roleId;
    }
}
