import Feature from "./Feature";
import Permission from "./Permission";
import Check, { AccessCheckRequest, CheckMany, FeatureCheck, PermissionCheck } from "../types/Check";
import Warrant, { isSubject, isWarrantObject } from "../types/Warrant";
import WarrantClient from "../WarrantClient";

export default class Authorization {
    public static async check(check: Check): Promise<boolean> {
        const accessCheckRequest: AccessCheckRequest = {
            warrants: [{
                objectType: isWarrantObject(check.object) ? check.object.getObjectType() : check.object.objectType,
                objectId: isWarrantObject(check.object) ? check.object.getObjectId() : check.object.objectId,
                relation: check.relation,
                subject: isSubject(check.subject) ? check.subject : { objectType: check.subject.getObjectType(), objectId: check.subject.getObjectId() },
                context: check.context
            }],
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
                objectType: isWarrantObject(warrant.object) ? warrant.object.getObjectType() : warrant.object.objectType,
                objectId: isWarrantObject(warrant.object) ? warrant.object.getObjectId() : warrant.object.objectId,
                relation: warrant.relation,
                subject: isSubject(warrant.subject) ? warrant.subject : { objectType: warrant.subject.getObjectType(), objectId: warrant.subject.getObjectId() },
                context: warrant.context
            }
        })
        const accessCheckRequest: AccessCheckRequest = {
            op: check.op,
            warrants: warrants,
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
            debug: featureCheck.debug
        })
    }

    public static async hasPermission(permissionCheck: PermissionCheck): Promise<boolean> {
        return this.check({
            object: new Permission(permissionCheck.permissionId),
            relation: "member",
            subject: permissionCheck.subject,
            context: permissionCheck.context,
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
