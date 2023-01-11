import Feature from "./Feature";
import Permission from "./Permission";
import Check, { AccessCheckRequest, CheckMany, FeatureCheck, PermissionCheck } from "../types/Check";
import Warrant from "../types/Warrant";
import WarrantClient from "../WarrantClient";

export default class Authorization {
    public static async check(check: Check): Promise<boolean> {
        const accessCheckRequest: AccessCheckRequest = {
            warrants: [{
                objectType: check.object.objectType,
                objectId: check.object.objectId,
                relation: check.relation,
                subject: check.subject,
                context: check.context
            }],
            consistentRead: check.consistentRead,
            debug: check.debug
        }
        if (WarrantClient.config.authorizeEndpoint) {
            return this.edgeAuthorize(accessCheckRequest);
        }

        return this.authorize(accessCheckRequest);
    }

    public static async checkMany(check: CheckMany): Promise<boolean> {
        let warrants: Warrant[] = check.warrants.map((warrant) => {
            return {
                objectType: warrant.object.objectType,
                objectId: warrant.object.objectId,
                relation: warrant.relation,
                subject: warrant.subject,
                context: warrant.context
            }
        })
        const accessCheckRequest: AccessCheckRequest = {
            op: check.op,
            warrants: warrants,
            consistentRead: check.consistentRead,
            debug: check.debug
        }

        if (WarrantClient.config.authorizeEndpoint) {
            return this.edgeAuthorize(accessCheckRequest);
        }

        return this.authorize(accessCheckRequest);
    }

    public static async hasFeature(featureCheck: FeatureCheck): Promise<boolean> {
        return this.check({
            object: new Feature(featureCheck.featureId),
            relation: "member",
            subject: featureCheck.subject,
            context: featureCheck.context,
            consistentRead: featureCheck.consistentRead,
            debug: featureCheck.debug
        })
    }

    public static async hasPermission(permissionCheck: PermissionCheck): Promise<boolean> {
        return this.check({
            object: new Permission(permissionCheck.permissionId),
            relation: "member",
            subject: permissionCheck.subject,
            context: permissionCheck.context,
            consistentRead: permissionCheck.consistentRead,
            debug: permissionCheck.debug
        })
    }

    // Private methods
    private static async authorize(accessCheckRequest: AccessCheckRequest): Promise<boolean> {
        try {
            const response = await WarrantClient.httpClient.post({
                url: "/v2/authorize",
                data: accessCheckRequest,
            });

            return response.code === 200;
        } catch (e) {
            throw e;
        }
    }

    private static async edgeAuthorize(warrantCheck: AccessCheckRequest): Promise<boolean> {
        try {
            const response = await WarrantClient.httpClient.post({
                baseUrl: WarrantClient.config.authorizeEndpoint,
                url: "/v2/authorize",
                data: warrantCheck,
            });

            return response.code === 200;
        } catch (e) {
            if (e.code === "cache_not_ready") {
                return this.authorize(warrantCheck);
            }

            throw e;
        }
    }
}
