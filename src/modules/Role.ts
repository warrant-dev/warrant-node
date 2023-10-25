import Authorization from "./Authorization";
import ObjectModule from "./ObjectModule";
import Permission from "./Permission";
import WarrantModule from "./WarrantModule";
import { ListResponse } from "../types/List";
import { WarrantObject, WarrantObjectLiteral } from "../types/Object";
import { ObjectType } from "../types/ObjectType";
import { ListPermissionOptions } from "../types/Permission";
import { QueryResult } from "../types/Query";
import { CreateRoleParams, ListRoleOptions } from "../types/Role";
import Warrant, { PolicyContext } from "../types/Warrant";
import { WarrantRequestOptions } from "../types/WarrantRequestOptions";


export default class Role implements WarrantObject {
    roleId: string;
    meta?: { [key: string]: any }

    constructor(roleId: string,  meta: { [key: string]: any }) {
        this.roleId = roleId;
        this.meta = meta;
    }

    //
    // Static methods
    //
    public static async create(role: CreateRoleParams = {}, options: WarrantRequestOptions = {}): Promise<Role> {
        try {
            const response = await ObjectModule.create({
                objectType: ObjectType.Role,
                objectId: role.roleId,
                meta: role.meta,
            }, options)

            return new Role(response.objectId, response.meta);
        } catch (e) {
            throw e;
        }
    }

    public static async get(roleId: string, options: WarrantRequestOptions = {}): Promise<Role> {
        try {
            const response = await ObjectModule.get(ObjectType.Role, roleId, options);

            return new Role(response.objectId, response.meta);
        } catch (e) {
            throw e;
        }
    }

    public static async update(roleId: string, meta: { [key: string]: any }, options: WarrantRequestOptions = {}): Promise<Role> {
        try {
            const response = await ObjectModule.update(ObjectType.Role, roleId, meta, options);

            return new Role(response.objectId, response.meta);
        } catch (e) {
            throw e;
        }
    }

    public static async delete(roleId: string, options: WarrantRequestOptions = {}): Promise<void> {
        return await ObjectModule.delete(ObjectType.Role, roleId, options);
    }

    public static async listRoles(listOptions: ListRoleOptions = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Role>> {
        try {
            const response = await ObjectModule.list({
                objectType: ObjectType.Role,
                ...listOptions,
            }, options);

            const roles: Role[] = response.results.map((object: WarrantObjectLiteral) => new Role(object.objectId, object.meta));
            return {
                ...response,
                results: roles,
            };
        } catch (e) {
            throw e;
        }
    }

    public static async listRolesForUser(userId: string, listOptions: ListRoleOptions = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Role>> {
        try {
            const queryResponse = await WarrantModule.query(`select role where user:${userId} is *`, listOptions, options);
            const roles: Role[] = queryResponse.results.map((queryResult: QueryResult) => new Role(queryResult.objectId, queryResult.meta));

            return {
                ...queryResponse,
                results: roles,
            };
        } catch (e) {
            throw e;
        }
    }

    public static async assignRoleToUser(userId: string, roleId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
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

    public static async removeRoleFromUser(userId: string, roleId: string, options: WarrantRequestOptions = {}): Promise<void> {
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
    public async listPermissions(listOptions: ListPermissionOptions = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Permission>> {
        return Permission.listPermissionsForRole(this.roleId, listOptions, options);
    }

    public async assignPermission(permissionId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return Permission.assignPermissionToRole(this.roleId, permissionId, options);
    }

    public async removePermission(permissionId: string, options: WarrantRequestOptions = {}): Promise<void> {
        return Permission.removePermissionFromRole(this.roleId, permissionId, options);
    }

    public async hasPermission(permissionId: string, context: PolicyContext = {}, options: WarrantRequestOptions = {}): Promise<boolean> {
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
