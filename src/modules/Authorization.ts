import WarrantClient from "../WarrantClient";
import { FEATURE_OBJECT_TYPE, PERMISSION_OBJECT_TYPE } from "../constants";
import Check, { CheckMany, FeatureCheck, PermissionCheck } from "../types/Check";

export default class Authorization {
    public static async check(check: Check): Promise<boolean> {
        const warrantCheck: CheckMany = {
            warrants: [{
                object: check.object,
                relation: check.relation,
                subject: check.subject,
                context: check.context
            }],
            consistentRead: check.consistentRead,
            debug: check.debug
        }
        if (WarrantClient.config.authorizeEndpoint) {
            return this.edgeAuthorize(warrantCheck);
        }

        return this.authorize(warrantCheck);
    }

    public static async checkMany(check: CheckMany): Promise<boolean> {
        if (WarrantClient.config.authorizeEndpoint) {
            return this.edgeAuthorize(check);
        }

        return this.authorize(check);
    }

    public static async hasFeature(featureCheck: FeatureCheck): Promise<boolean> {
        const warrantCheck: CheckMany = {
            warrants: [{
                object: {
                    objectType: FEATURE_OBJECT_TYPE,
                    objectId: featureCheck.featureId
                },
                relation: "member",
                subject: featureCheck.subject,
                context: featureCheck.context
            }],
            consistentRead: featureCheck.consistentRead,
            debug: featureCheck.debug
        };

        if (WarrantClient.config.authorizeEndpoint) {
            return this.edgeAuthorize(warrantCheck);
        }

        return this.authorize(warrantCheck);
    }

    public static async hasPermission(permissionCheck: PermissionCheck): Promise<boolean> {
        const warrantCheck: CheckMany = {
            warrants: [{
                object: {
                    objectType: PERMISSION_OBJECT_TYPE,
                    objectId: permissionCheck.permissionId,
                },
                relation: "member",
                subject: permissionCheck.subject,
                context: permissionCheck.context
            }],
            consistentRead: permissionCheck.consistentRead,
            debug: permissionCheck.debug
        };

        if (WarrantClient.config.authorizeEndpoint) {
            return this.edgeAuthorize(warrantCheck);
        }

        return this.authorize(warrantCheck);
    }

    // Private methods
    private static async authorize(warrantCheck: CheckMany): Promise<boolean> {
        try {
            const response = await WarrantClient.httpClient.post({
                url: "/v2/authorize",
                data: warrantCheck,
            });

            return response.code === 200;
        } catch (e) {
            console.log("Error performing access check");
            throw e;
        }
    }

    private static async edgeAuthorize(warrantCheck: CheckMany): Promise<boolean> {
        try {
            const response = await WarrantClient.httpClient.post({
                baseUrl: WarrantClient.config.authorizeEndpoint,
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
}
