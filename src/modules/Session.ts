import WarrantClient from "../WarrantClient";
import { SELF_SERVICE_DASH_URL_BASE } from "../constants";
import { SessionParams } from "../types/Session";

export default class Session {
    /**
     * Creates an authorization session in Warrant for the specified userId and returns a session token that can be used to
     * make authorization requests to the Warrant API scoped to the specified userId and tenantId.
     *
     * @param session A session object containing the userId, redirectUrl, and optional tenantId for which the authorization session should be created.
     * @returns A session token that can be passed to any of the Warrant client-side SDKs to allow the SDK to make client-side authorization checks for the specified user.
     */
     public static async createAuthorizationSession(session: SessionParams): Promise<string> {
        try {
            const sess = await WarrantClient.httpClient.post({
                url: "/v1/sessions",
                data: {
                    ...session,
                    type: "sess",
                },
            });

            return sess.token;
        } catch (e) {
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
    public static async createSelfServiceSession(session: SessionParams, redirectUrl: string): Promise<string> {
        try {
            const sess = await WarrantClient.httpClient.post({
                url: "/v1/sessions",
                data: {
                    ...session,
                    type: "ssdash",
                },
            });

            return `${SELF_SERVICE_DASH_URL_BASE}/${sess.token}?redirectUrl=${redirectUrl}`;
        } catch (e) {
            throw e;
        }
    }
}
