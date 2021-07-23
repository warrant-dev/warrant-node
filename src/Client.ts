import Axios, { AxiosInstance } from "axios";
import { API_URL_BASE, API_VERSION } from "./constants";
import User from "./types/User";
import Userset from "./types/Userset";
import Warrant from "./types/Warrant";

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
     * Creates a user entity in Warrant with the specified `userId`.
     * Call this method whenever a new user is created in your application. After using this method to create a user entity
     * in Warrant, you can then use the isAuthorized method to authorize subsequent actions the specified user takes in your application.
     *
     * @param userId
     * The unique identifier to assign to this user in order to identify them in the future. This could be a unique identifier you
     * already use in your application (i.e. a database generated id). This parameter is optional and Warrant will generate a userId for
     * the user if it is not provided.
     */
    public async createUser(userId: string): Promise<User> {
        try {
            const response = await this.httpClient.post("/users", {
                userId,
            });

            return response.data;
        } catch (e) {
            console.log("Error creating user in Warrant", e.response.data);

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
     public async createWarrant(objectType: string, objectId: string, relation: string, user: User | Userset): Promise<Warrant> {
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
}
