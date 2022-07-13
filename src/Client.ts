import { API_URL_BASE, SELF_SERVICE_DASH_URL_BASE } from "./constants";
import Config from "./types/Config";
import ApiClient from "./HttpClient";
import Permission, { ListPermissionOptions } from "./types/Permission";
import Role, { ListRoleOptions } from "./types/Role";
import Tenant, { ListTenantOptions } from "./types/Tenant";
import User, { ListUserOptions } from "./types/User";
import Warrant, { ListWarrantOptions } from "./types/Warrant";
import Session from "./types/Session";
import WarrantCheck from "./types/WarrantCheck";
import PermissionCheck from "./types/PermissionCheck";

export default class Client {
    private readonly config: Config;
    private readonly httpClient: ApiClient;

    constructor(config: Config) {
        this.config = config;
        this.httpClient = new ApiClient({
            apiKey: this.config.apiKey,
            baseUrl: `${API_URL_BASE}`,
        });
    }

    //
    // Tenant methods
    //
    public async getTenant(tenantId: string): Promise<Tenant> {
        try {
            return await this.httpClient.get({
                url: `/v1/tenants/${tenantId}`,
            });
        } catch (e) {
            console.log("Error getting tenant");
            throw e;
        }
    }

    public async createTenant(tenant: Tenant): Promise<Tenant> {
        try {
            return await this.httpClient.post({
                url: "/v1/tenants",
                data: tenant,
            });
        } catch (e) {
            console.log("Error creating tenant");
            throw e;
        }
    }

    public async updateTenant(tenantId: string, tenant: Tenant): Promise<Tenant> {
        try {
            return await this.httpClient.put({
                url: `/v1/tenants/${tenantId}`,
                data: tenant,
            });
        } catch (e) {
            console.log("Error updating tenant");
            throw e;
        }
    }

    public async deleteTenant(tenantId: string): Promise<void> {
        try {
            return await this.httpClient.delete({
                url: `/v1/tenants/${tenantId}`,
            });
        } catch (e) {
            console.log("Error deleting tenant");
            throw e;
        }
    }

    public async listTenants(listOptions: ListTenantOptions): Promise<Tenant[]> {
        try {
            return await this.httpClient.get({
                url: "/v1/tenants",
                params: listOptions,
            });
        } catch (e) {
            console.log("Error listing tenants");
            throw e;
        }
    }

    //
    // User methods
    //
    public async getUser(userId: string): Promise<User> {
        try {
            return await this.httpClient.get({
                url: `/v1/users/${userId}`,
            });
        } catch (e) {
            console.log("Error getting user");
            throw e;
        }
    }

    public async createUser(user: User): Promise<User> {
        try {
            return await this.httpClient.post({
                url: "/v1/users",
                data: user,
            });
        } catch (e) {
            console.log("Error creating user");
            throw e;
        }
    }

    public async updateUser(userId: string, user: User): Promise<User> {
        try {
            return await this.httpClient.put({
                url: `/v1/users/${userId}`,
                data: user,
            });
        } catch (e) {
            console.log("Error updating user");
            throw e;
        }
    }

    public async deleteUser(userId: string): Promise<void> {
        try {
            return await this.httpClient.delete({
                url: `/v1/users/${userId}`,
            });
        } catch (e) {
            console.log("Error deleting user");
            throw e;
        }
    }

    public async listUsers(listOptions: ListUserOptions): Promise<User[]> {
        try {
            return await this.httpClient.get({
                url: "/v1/users",
                params: listOptions,
            });
        } catch (e) {
            console.log("Error listing users");
            throw e;
        }
    }

    //
    // Role methods
    //
    public async getRole(roleId: string): Promise<Role> {
        try {
            return await this.httpClient.get({
                url: `/v1/roles/${roleId}`,
            });
        } catch (e) {
            console.log("Error getting role");
            throw e;
        }
    }

    public async createRole(role: Role): Promise<Role> {
        try {
            return await this.httpClient.post({
                url: "/v1/roles",
                data: role,
            });
        } catch (e) {
            console.log("Error creating role in Warrant");
            throw e;
        }
    }

    public async deleteRole(roleId: string): Promise<void> {
        try {
            await this.httpClient.delete({
                url: `/v1/roles/${roleId}`,
            });
        } catch (e) {
            console.log("Error deleting role");
            throw e;
        }
    }

    public async listRoles(listOptions: ListRoleOptions): Promise<Role[]> {
        try {
            return await this.httpClient.get({
                url: "/v1/roles",
                params: listOptions,
            });
        } catch (e) {
            console.log("Error listing roles");
            throw e;
        }
    }

    public async assignRoleToUser(roleId: string, userId: string): Promise<Role> {
        try {
            return await this.httpClient.post({
                url: `/v1/users/${userId}/roles/${roleId}`,
            });
        } catch (e) {
            console.log("Error assigning role to user");
            throw e;
        }
    }

    public async removeRoleFromUser(roleId: string, userId: string): Promise<void> {
        try {
            await this.httpClient.delete({
                url: `/users/${userId}/roles/${roleId}`,
            });
        } catch (e) {
            console.log("Error removing role from user");
            throw e;
        }
    }

    //
    // Permission methods
    //
    public async getPermission(permissionId: string): Promise<Permission> {
        try {
            return await this.httpClient.get({
                url: `/v1/permissions/${permissionId}`,
            });
        } catch (e) {
            console.log("Error getting permission");
            throw e;
        }
    }

    public async createPermission(permission: Permission): Promise<Permission> {
        try {
            return await this.httpClient.post({
                url: "/v1/permissions",
                data: permission,
            });
        } catch (e) {
            console.log("Error creating permission");
            throw e;
        }
    }

    public async deletePermission(permissionId: string): Promise<void> {
        try {
            await this.httpClient.delete({
                url: `/v1/permissions/${permissionId}`,
            });
        } catch (e) {
            console.log("Error deleting permission");
            throw e;
        }
    }

    public async listPermissions(listOptions: ListPermissionOptions): Promise<Permission[]> {
        try {
            return await this.httpClient.get({
                url: "/v1/permissions",
                params: listOptions,
            });
        } catch (e) {
            console.log("Error listing permissions");
            throw e;
        }
    }

    public async assignPermissionToUser(permissionId: string, userId: string): Promise<Permission> {
        try {
            return await this.httpClient.post({
                url: `/v1/users/${userId}/permissions/${permissionId}`,
            });
        } catch (e) {
            console.log("Error assigning permission to user");
            throw e;
        }
    }

    public async removePermissionFromUser(permissionId: string, userId: string): Promise<void> {
        try {
            await this.httpClient.delete({
                url: `/v1/users/${userId}/permissions/${permissionId}`,
            });
        } catch (e) {
            console.log("Error removing permission from user");
            throw e;
        }
    }

    public async assignPermissionToRole(permissionId: string, roleId: string): Promise<Permission> {
        try {
            return await this.httpClient.post({
                url: `/v1/roles/${roleId}/permissions/${permissionId}`,
            });
        } catch (e) {
            console.log("Error assigning permission to role");
            throw e;
        }
    }

    public async removePermissionFromRole(permissionId: string, roleId: string): Promise<void> {
        try {
            await this.httpClient.delete({
                url: `/v1/roles/${roleId}/permissions/${permissionId}`,
            });
        } catch (e) {
            console.log("Error removing permission from role");
            throw e;
        }
    }

    //
    // Warrant methods
    //
    public async createWarrant(warrant: Warrant): Promise<Warrant> {
        try {
            return await this.httpClient.post({
                url: "/v1/warrants",
                data: warrant,
            });
        } catch (e) {
            console.log("Error creating warrant");
            throw e;
        }
    }

    public async deleteWarrant(warrant: Warrant): Promise<Warrant> {
        try {
            return await this.httpClient.delete({
                url: "/v1/warrants",
                data: warrant,
            });
        } catch (e) {
            console.log("Error deleting warrant");
            throw e;
        }
    }

    public async listWarrants(listOptions: ListWarrantOptions = {}): Promise<Warrant[]> {
        try {
            return await this.httpClient.get({
                url: "/warrants",
                params: listOptions,
            });
        } catch (e) {
            console.log("Error listing warrants");
            throw e;
        }
    }

    /**
     * Creates an authorization session in Warrant for the specified userId and returns a session token that can be used to
     * make authorization requests to the Warrant API scoped to the specified userId and tenantId.
     *
     * @param session A session object containing the userId, redirectUrl, and optional tenantId for which the authorization session should be created.
     * @returns A session token that can be passed to any of the Warrant client-side SDKs to allow the SDK to make client-side authorization checks for the specified user.
     */
    public async createAuthorizationSession(session: Session): Promise<string> {
        try {
            const sess = await this.httpClient.post({
                url: "/v1/sessions",
                data: {
                    ...session,
                    type: "sess",
                },
            });

            return sess.token;
        } catch (e) {
            console.log("Error creating authorization session for user");
            throw e;
        }
    }

    /**
     * Creates a self-service session in Warrant for the user with the specified userId and returns a session token that can be used to
     * make authorized requests to the Warrant API scoped to the specified userId and tenantId.
     *
     * @param session A session object containing the userId, redirectUrl, and optional tenantId for which the self service session should be created.
     * @returns A url pointing to the self-service dashboard that will allow the specified user to make changes to the roles and permissions of users in their tenant.
     */
    public async createSelfServiceSession(session: Session, redirectUrl: string): Promise<string> {
        try {
            const sess = await this.httpClient.post({
                url: "/v1/sessions",
                data: {
                    ...session,
                    type: "ssdash",
                },
            });

            return `${SELF_SERVICE_DASH_URL_BASE}/${sess.token}?redirectUrl=${redirectUrl}`;
        } catch (e) {
            console.log("Error creating self-service session for user");
            throw e;
        }
    }

    /**
     * Checks against the warrants defined for your application to determine if the given `userId` has the given
     * `relation` to the given `objectId` of type `objectType`. Returns true if the the relation exists and false otherwise.
     * @param objectType The type of the object for which access is being checked.
     * @param objectId The id of the object for which access is being checked.
     * @param relation The relation to the object for which access is being checked.
     * @param userId The userId for which access is being checked.
     * @returns True if the `userId` has the given `relation` to `objectId` of type `objectType`, and false otherwise.
     */
    /**
     * Checks against the warrants defined for your application to determine if the given `userId` has the given
     * `relation` to the given `objectId` of type `objectType`. Returns true if the the relation exists and false otherwise.
     * @param options access check options for this authorization request, including the objectType, objectId, relation, and subject
     * for which access is being checked.
     * @returns True if the `subject` has the given `relation` to `objectId` of type `objectType`, and false otherwise.
     */
    public async isAuthorized(warrantCheck: WarrantCheck): Promise<boolean> {
        if (this.config.authorizeEndpoint) {
            return this.edgeAuthorize(warrantCheck);
        }

        return this.authorize(warrantCheck);
    }


    //
    // Authorize methods
    //
    private async authorize(warrantCheck: WarrantCheck): Promise<boolean> {
        try {
            const response = await this.httpClient.post({
                url: "/v2/authorize",
                data: warrantCheck,
            });

            return response.code === 200;
        } catch (e) {
            console.log("Error performing access check");
            throw e;
        }
    }

    private async edgeAuthorize(warrantCheck: WarrantCheck): Promise<boolean> {
        try {
            const response = await this.httpClient.post({
                baseUrl: this.config.authorizeEndpoint,
                url: "/v2/authorize",
                data: warrantCheck,
            });

            return response.code === 200;
        } catch (e) {
            if (e.code === "cache_not_ready") {
                console.log("Edge cache not ready. Re-routing access check to api.warrant.dev");
                return this.authorize(warrantCheck);
            }

            console.log("Error performing access check");
            throw e;
        }
    }

    public async hasPermission(permissionCheck: PermissionCheck): Promise<boolean> {
        return this.isAuthorized({
            warrants: [{
                objectType: "permission",
                objectId: permissionCheck.permissionId,
                relation: "member",
                subject: {
                    objectType: "user",
                    objectId: permissionCheck.userId,
                },
            }],
            consistentRead: permissionCheck.consistentRead,
            debug: permissionCheck.debug,
        });
    }
}
