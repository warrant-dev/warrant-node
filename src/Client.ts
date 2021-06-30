import Axios, { AxiosInstance } from "axios";
import { API_URL_BASE, API_VERSION } from "./constants";
import User from "./types/user";

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

    /**
     * Creates a user entity in Warrant with the specified userId and assigns the created user the role with the specified roleId.
     * Call this method whenever a new user is created in your application. After using this method to create a user entity
     * in Warrant, you can then the isAuthorized method to authorize subsequent actions the specified user takes in your application.
     *
     * @param userId
     * The unique identifier to assign to this user in order to identify them in the future. This could be a unique identifier you
     * already use in your application (i.e. a database generated id). This parameter is optional and Warrant will generate a userId for
     * the user if it is not provided.
     * @param roleId
     * The id of the role (from the Warrant dashboard) that you would like to assign to this user. This parameter is optional and
     * no role will be assigned to this user if it is not provided. Note: the user will not have any permissions as a result.
     */
    public async createUser(userId?: string, roleId?: string): Promise<User> {
        try {
            const user: User = {};

            if (userId) {
                user.userId = userId;
            }

            if (roleId) {
                user.role = {
                    roleId,
                }
            }

            const response = await this.httpClient.post("/users", user);
            return response.data;
        } catch (e) {
            console.log("Error creating user in Warrant", e);

            throw e;
        }
    }

    /**
     * Creates a session in Warrant for the user with the specified userId and returns a session token which can be used to
     * make authorized requests to the Warrant API scoped to the specified user.
     *
     * @param userId The unique identifier assigned in Warrant to identify the specified user.
     * @returns The session token representing the specified user's active session. Use this session token (i.e in a Client application)
     * to make authorized requests to the Warrant API scoped only to the specified user.
     */
    public async createSession(userId: string): Promise<string> {
        try {
            const response = await this.httpClient.post(`/users/${userId}/session/create`);

            return response.data.sessionToken;
        } catch (e) {
            console.log("Error creating session for user in Warrant", e);

            throw e;
        }
    }

    /**
     * Checks against your role permission and user permission assignments in Warrant to determine if the user with the specified
     * userId has the permission with the specified permissionName. Returns true if the user does have the permission and false otherwise.
     *
     * @param userId The unique identifier assigned in Warrant to identify the specified user.
     * @param permissionName The name of the permission (from the Warrant dashboard) that you would like to check access against for the specified user.
     */
    public async isAuthorized(userId: string, permissionName: string): Promise<boolean> {
        try {
            const response = await this.httpClient.get(`/users/${userId}/authorize/${permissionName}`);
            if (response.status === 200) {
                return true;
            }
        } catch (e) {
            if (e.response.status !== 401) {
                console.log("Error authorizing access through Warrant", e);
            }

            return false;
        }
    }
}
