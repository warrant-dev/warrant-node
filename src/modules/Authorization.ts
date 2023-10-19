import Feature from "./Feature";
import Permission from "./Permission";
import Check, { AccessCheckRequest, CheckMany, CheckWarrant, FeatureCheck, PermissionCheck } from "../types/Check";
import { isWarrantObject } from "../types/Object";
import { ObjectType } from "../types/ObjectType";
import { isSubject } from "../types/Warrant";
import { WarrantRequestOptions } from "../types/WarrantRequestOptions";
import WarrantClient from "../WarrantClient";
import { API_VERSION } from "../constants";

export default class Authorization {
    public static async check(check: Check, options: WarrantRequestOptions = {}): Promise<boolean> {
        const accessCheckRequest: AccessCheckRequest = {
            warrants: [{
                object: check.object,
                relation: check.relation,
                subject: check.subject,
                context: check.context
            }],
            debug: check.debug
        }
        if (WarrantClient.config.authorizeEndpoint) {
            return this.edgeAuthorize(accessCheckRequest, options);
        }

        return this.authorize(accessCheckRequest, options);
    }

    public static async checkMany(check: CheckMany, options: WarrantRequestOptions = {}): Promise<boolean> {
        let warrants: CheckWarrant[] = check.warrants.map((warrant) => {
            return {
                object: warrant.object,
                relation: warrant.relation,
                subject: warrant.subject,
                context: warrant.context
            }
        })
        const accessCheckRequest: AccessCheckRequest = {
            op: check.op,
            warrants: warrants,
            debug: check.debug
        }

        if (WarrantClient.config.authorizeEndpoint) {
            return this.edgeAuthorize(accessCheckRequest, options);
        }

        return this.authorize(accessCheckRequest, options);
    }

    public static async hasFeature(featureCheck: FeatureCheck, options: WarrantRequestOptions = {}): Promise<boolean> {
        return this.check({
            object: {
                objectType: ObjectType.Feature,
                objectId: featureCheck.featureId,
            },
            relation: "member",
            subject: featureCheck.subject,
            context: featureCheck.context,
            debug: featureCheck.debug
        }, options)
    }

    public static async hasPermission(permissionCheck: PermissionCheck, options: WarrantRequestOptions = {}): Promise<boolean> {
        return this.check({
            object: {
                objectType: ObjectType.Permission,
                objectId: permissionCheck.permissionId,
            },
            relation: "member",
            subject: permissionCheck.subject,
            context: permissionCheck.context,
            debug: permissionCheck.debug
        }, options)
    }

    // Private methods
    private static async authorize(accessCheckRequest: AccessCheckRequest, options: WarrantRequestOptions = {}): Promise<boolean> {
        try {

            const response = await WarrantClient.httpClient.post({
                url: `/${API_VERSION}/check`,
                data: {
                    ...accessCheckRequest,
                    warrants: this.mapWarrantsForRequest(accessCheckRequest.warrants),
                },
                options,
            });

            return response.code === 200;
        } catch (e) {
            throw e;
        }
    }

    private static async edgeAuthorize(accessCheckRequest: AccessCheckRequest, options: WarrantRequestOptions = {}): Promise<boolean> {
        try {
            const response = await WarrantClient.httpClient.post({
                baseUrl: WarrantClient.config.authorizeEndpoint,
                url: `/${API_VERSION}/check`,
                data: {
                    ...accessCheckRequest,
                    warrants: this.mapWarrantsForRequest(accessCheckRequest.warrants),
                },
                options,
            });

            return response.code === 200;
        } catch (e) {
            if (e.code === "cache_not_ready") {
                return this.authorize(accessCheckRequest);
            }

            throw e;
        }
    }

    private static mapWarrantsForRequest(warrants: CheckWarrant[]): any[] {
        return warrants.map((warrant) => {
            return {
                objectType: isWarrantObject(warrant.object) ? warrant.object.getObjectType() : warrant.object.objectType,
                objectId: isWarrantObject(warrant.object) ? warrant.object.getObjectId() : warrant.object.objectId,
                relation: warrant.relation,
                subject: isSubject(warrant.subject) ? warrant.subject : { objectType: warrant.subject.getObjectType(), objectId: warrant.subject.getObjectId() },
                context: warrant.context
            }
        })
    }
}
