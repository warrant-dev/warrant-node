import Axios, { AxiosInstance } from "axios";
import { API_URL_BASE, API_VERSION } from "./constants";
import Permission from "./types/Permission";
import Role from "./types/Role";
import Session from "./types/Session";
import Tenant from "./types/Tenant";
import User from "./types/User";
import Warrant, { WarrantUser } from "./types/Warrant";

export default class Client {
    private readonly apiKey: string;
    private httpClient: AxiosInstance;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.httpClient = Axios.create({
            baseURL: `${API_URL_BASE}/${API_VERSION}`,
            headers: {
                Authorization: `ApiKey ${this.apiKey}`,
            },
        });
    }

    public async createTenant(tenantId?: string): Promise<Tenant> {
        try {
            const response = await this.httpClient.post("/tenants", {
                tenantId,
            });
            return response.data;
        } catch (e) {
            console.log("Error creating tenant in Warrant", e.response.data);

            throw e;
        }
    }

    /**
     * Creates a user entity in Warrant with the specified `userId`.
     * Call this method whenever a new user is created in your application. After using this method to create a user entity
     * in Warrant, you can then use the isAuthorized method to authorize subsequent actions the specified user takes in your application.
     *
     * @param email
     * The user's email in your system.
     *
     * @param userId
     * The unique identifier to assign to this user in order to identify them in the future. This could be a unique identifier you
     * already use in your application (i.e. a database generated id). This parameter is optional and Warrant will generate a userId for
     * the user if it is not provided.
     */
    public async createUser(email: string, userId?: string, tenantId?: string): Promise<User> {
        try {
            const requestBody: any = {
                email,
            };

            if (userId) {
                requestBody.userId = userId;
            }

            if (tenantId) {
                requestBody.tenantId = tenantId;
            }

            const response = await this.httpClient.post("/users", requestBody);
            return response.data;
        } catch (e) {
            console.log("Error creating user in Warrant", e.response.data);

            throw e;
        }
    }

    public async createRole(roleId: string): Promise<Role> {
        try {
            const response = await this.httpClient.post("/roles", {
                roleId,
            });

            return response.data;
        } catch (e) {
            console.log("Error creating role in Warrant", e.response.data);

            throw e;
        }
    }

    public async deleteRole(roleId: string): Promise<void> {
        try {
            await this.httpClient.delete(`/roles/${roleId}`);
        } catch (e) {
            console.log("Error deleting role in Warrant", e.response.data);

            throw e;
        }
    }

    public async createPermission(permissionId: string): Promise<Permission> {
        try {
            const response = await this.httpClient.post("/permissions", {
                permissionId,
            });

            return response.data;
        } catch (e) {
            console.log("Error creating permission in Warrant", e.response.data);

            throw e;
        }
    }

    public async deletePermission(permissionId: string): Promise<void> {
        try {
            await this.httpClient.delete(`/permissions/${permissionId}`);
        } catch (e) {
            console.log("Error deleting permission in Warrant", e.response.data);

            throw e;
        }
    }

    /**
     * Creates a warrant (authorization rule) in Warrant which specifies that the user (or userset) provided as `user` has the
     * given `relation` to the object of type `objectType` with id `objectId`.
     *
     * @param objectType The type of object this warrant is granting access to.
     * @param objectId The id of the object this warrant is granting access to.
     * @param relation The relation this warrant grants the user (or userset) on the object.
     * @param user The user (userId) or userset (objectType + objectId + relation) this warrant will apply to.
     * @returns The newly created warrant.
     */
    public async createWarrant(objectType: string, objectId: string, relation: string, user: WarrantUser): Promise<Warrant> {
        try {
            const response = await this.httpClient.post("/warrants", {
                objectType,
                objectId,
                relation,
                user,
            });

            return response.data;
        } catch (e) {
            console.log("Error creating warrant in Warrant", e.response.data);

            throw e;
        }
    }

    public async assignRoleToUser(userId: string, roleId: string): Promise<Role> {
        try {
            const response = await this.httpClient.post(`/users/${userId}/roles/${roleId}`);

            return response.data;
        } catch (e) {
            console.log("Error assigning role to user in Warrant", e.response.data);

            throw e;
        }
    }

    public async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
        try {
            await this.httpClient.delete(`/users/${userId}/roles/${roleId}`);
        } catch (e) {
            console.log("Error removing role from user in Warrant", e.response.data);

            throw e;
        }
    }

    public async assignPermissionToUser(userId: string, permissionId: string): Promise<Role> {
        try {
            const response = await this.httpClient.post(`/users/${userId}/permissions/${permissionId}`);

            return response.data;
        } catch (e) {
            console.log("Error assigning permission to user in Warrant", e.response.data);

            throw e;
        }
    }

    public async removePermissionFromUser(userId: string, permissionId: string): Promise<void> {
        try {
            await this.httpClient.delete(`/users/${userId}/permissions/${permissionId}`);
        } catch (e) {
            console.log("Error removing permission from user in Warrant", e.response.data);

            throw e;
        }
    }

    /**
     * Creates a session in Warrant for the user with the specified `userId` and returns a session token which can be used to
     * make authorized requests to the Warrant API scoped to the specified user.
     *
     * @param userId The unique identifier assigned in Warrant to identify the specified user.
     * @returns The session token representing the specified user's active session. Use this session token (i.e in a Client application)
     * to make authorized requests to the Warrant API scoped only to the specified user.
     */
    public async createSession(userId: string): Promise<string> {
        try {
            const response = await this.httpClient.post(`/users/${userId}/sessions`);

            return response.data.token;
        } catch (e) {
            console.log("Error creating session for user in Warrant", e.response.data);

            throw e;
        }
    }

    /**
     * Creates a self-service session in Warrant for the user with the specified userId and returns a session token which can be used to
     * make authorized requests to the Warrant API scoped to the specified tenantId.
     *
     * @param session A session object containing the userId, redirectUrl, and optional tenantId for which the self service session should be created.
     * @returns A url pointing to the self-service dashboard that will allow the specified user to make changes to the roles and permissions of users in their tenant.
     */
    public async createSelfServiceSession(session: Session): Promise<string> {
        try {
            const response = await this.httpClient.post(`/sessions`, {
                ...session,
                type: "ssdash",
            });

            return response.data.url;
        } catch (e) {
            console.log("Error creating self-service session for user in Warrant", e.response.data);

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
    public async isAuthorized(objectType: string, objectId: string, relation: string, userId: string): Promise<boolean> {
        try {
            const response = await this.httpClient.post("/authorize", {
                objectType,
                objectId,
                relation,
                user: {
                    userId,
                },
            });

            if (response.status === 200) {
                return true;
            }
        } catch (e) {
            if (e.response.status !== 401) {
                console.log("Error authorizing access through Warrant", e.response.data);
            }

            return false;
        }
    }

    public async hasPermission(permissionId: string, userId: string): Promise<boolean> {
        return this.isAuthorized("permission", permissionId, "member", userId);
    }
}
