import {
    ListResponse,
    WarrantObject,
    BaseWarrantObject,
    ListPermissionParams,
    QueryResult,
    CreateRoleParams,
    ListRoleParams,
    UpdateRoleParams,
    Warrant,
    PermissionCheckParams,
} from "../types";
import Authorization from "./Authorization";
import ObjectModule from "./ObjectModule";
import Permission from "./Permission";
import WarrantModule from "./WarrantModule";
import { ObjectType } from "../types/ObjectType";
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
        const response = await ObjectModule.create({
            object: {
                objectType: ObjectType.Role,
                objectId: role.roleId,
            },
            meta: role.meta,
        }, options)

        return new Role(response.objectId, response.meta);
    }

    public static async get(roleId: string, options: WarrantRequestOptions = {}): Promise<Role> {
        const response = await ObjectModule.get({
            objectType: ObjectType.Role,
            objectId: roleId,
        }, options);

        return new Role(response.objectId, response.meta);
    }

    public static async update(roleId: string, params: UpdateRoleParams, options: WarrantRequestOptions = {}): Promise<Role> {
        const response = await ObjectModule.update({
            objectType: ObjectType.Role,
            objectId: roleId,
        }, { meta: params.meta }, options);

        return new Role(response.objectId, response.meta);
    }

    public static async delete(roleId: string, options: WarrantRequestOptions = {}): Promise<string> {
        return ObjectModule.delete({
            objectType: ObjectType.Role,
            objectId: roleId,
        }, options);
    }

    public static async listRoles(listParams: ListRoleParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Role>> {
        const response = await ObjectModule.list({
            objectType: ObjectType.Role,
            ...listParams,
        }, options);

        const roles: Role[] = response.results.map((object: BaseWarrantObject) => new Role(object.objectId, object.meta));
        return {
            ...response,
            results: roles,
        };
    }

    public static async listRolesForUser(userId: string, listParams: ListRoleParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Role>> {
        const queryResponse = await WarrantModule.query(`select role where user:${userId} is *`, listParams, options);
        const roles: Role[] = queryResponse.results.map((queryResult: QueryResult) => new Role(queryResult.objectId, queryResult.meta));

        return {
            ...queryResponse,
            results: roles,
        };
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

    public static async removeRoleFromUser(userId: string, roleId: string, options: WarrantRequestOptions = {}): Promise<string> {
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
    public async listPermissions(listParams: ListPermissionParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Permission>> {
        return Permission.listPermissionsForRole(this.roleId, listParams, options);
    }

    public async assignPermission(permissionId: string, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return Permission.assignPermissionToRole(this.roleId, permissionId, options);
    }

    public async removePermission(permissionId: string, options: WarrantRequestOptions = {}): Promise<string> {
        return Permission.removePermissionFromRole(this.roleId, permissionId, options);
    }

    public async hasPermission(params: PermissionCheckParams, options: WarrantRequestOptions = {}): Promise<boolean> {
        return Authorization.hasPermission({ permissionId: params.permissionId, subject: { objectType: ObjectType.Role, objectId: this.roleId }, context: params.context }, options);
    }

    // WarrantObject methods
    public getObjectType(): string {
        return ObjectType.Role;
    }

    public getObjectId(): string {
        return this.roleId;
    }
}
