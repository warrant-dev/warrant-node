import { API_URL_BASE, SELF_SERVICE_DASH_URL_BASE } from "./constants";
import ListWarrantFilters from "./types/ListWarrantFilters";
import ApiClient from "./HttpClient";
import { SDKConfig } from "./types/Config";
import Permission from "./types/Permission";
import Role from "./types/Role";
import Session from "./types/Session";
import Tenant from "./types/Tenant";
import User from "./types/User";
import Warrant from "./types/Warrant";
import WarrantCheck from "./types/WarrantCheck";
import PermissionCheck from "./types/PermissionCheck";

export default class Client {
    private readonly config: SDKConfig;
    private readonly httpClient: ApiClient;

    constructor(config: SDKConfig) {
        this.config = config;
        this.httpClient = new ApiClient({
            apiKey: this.config.apiKey,
            baseUrl: `${API_URL_BASE}`,
        });
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

    public async listWarrants(filters: ListWarrantFilters = {}): Promise<Warrant[]> {
        try {
            const response = await this.httpClient.get({
                url: "/warrants",
                data: {
                    params: filters,
                },
            });

            return response.data;
        } catch (e) {
            console.log("Error getting warrants in Warrant", e.response.data);

            throw e;
        }
    }

    public async assignRoleToUser(userId: string, roleId: string): Promise<Role> {
        try {
            return await this.httpClient.post({
                url: `/v1/users/${userId}/roles/${roleId}`,
            });
        } catch (e) {
            console.log("Error assigning role to user");
            throw e;
        }
    }

    public async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
        try {
            await this.httpClient.delete({
                url: `/users/${userId}/roles/${roleId}`,
            });
        } catch (e) {
            console.log("Error removing role from user");
            throw e;
        }
    }

    public async assignPermissionToUser(userId: string, permissionId: string): Promise<Role> {
        try {
            return await this.httpClient.post({
                url: `/v1/users/${userId}/permissions/${permissionId}`,
            });
        } catch (e) {
            console.log("Error assigning permission to user");
            throw e;
        }
    }

    public async removePermissionFromUser(userId: string, permissionId: string): Promise<void> {
        try {
            await this.httpClient.delete({
                url: `/v1/users/${userId}/permissions/${permissionId}`,
            });
        } catch (e) {
            console.log("Error removing permission from user");
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
