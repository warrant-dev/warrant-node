import {
    BatchCheckParams,
    Check,
    CheckOp,
    CheckParams,
    CheckManyParams,
    CheckResult,
    FeatureCheckParams,
    PermissionCheckParams,
    checkWarrantParamsToCheckWarrant,
} from "../types/Check";
import { ObjectType } from "../types/ObjectType";
import { WarrantRequestOptions } from "../types/WarrantRequestOptions";
import WarrantClient from "../WarrantClient";
import { API_VERSION } from "../constants";

export default class Authorization {
    public static async check(checkParams: CheckParams, options: WarrantRequestOptions = {}): Promise<boolean> {
        const check: Check = {
            warrants: [checkWarrantParamsToCheckWarrant(checkParams)],
            debug: checkParams.debug
        };

        if (WarrantClient.config.authorizeEndpoint && options.warrantToken != "latest") {
            return this.makeEdgeCheckRequest(check, options);
        }

        return this.makeCheckRequest(check, options);
    }

    public static async checkMany(checkParams: CheckManyParams, options: WarrantRequestOptions = {}): Promise<boolean> {
        const check: Check = {
            op: checkParams.op,
            warrants: checkParams.warrants.map((checkWarrantParams) => checkWarrantParamsToCheckWarrant(checkWarrantParams)),
            debug: checkParams.debug
        };

        if (WarrantClient.config.authorizeEndpoint && options.warrantToken != "latest") {
            return this.makeEdgeCheckRequest(check, options);
        }

        return this.makeCheckRequest(check, options);
    }

    public static async batchCheck(checkParams: BatchCheckParams, options: WarrantRequestOptions = {}): Promise<boolean[]> {
        const check: Check = {
            op: CheckOp.Batch,
            warrants: checkParams.warrants.map((checkWarrantParams) => checkWarrantParamsToCheckWarrant(checkWarrantParams)),
            debug: checkParams.debug
        };

        return this.makeBatchCheckRequest(check, options);
    }

    public static async hasFeature(featureCheckParams: FeatureCheckParams, options: WarrantRequestOptions = {}): Promise<boolean> {
        return this.check({
            object: {
                objectType: ObjectType.Feature,
                objectId: featureCheckParams.featureId,
            },
            relation: "member",
            subject: featureCheckParams.subject,
            context: featureCheckParams.context,
            debug: featureCheckParams.debug
        }, options);
    }

    public static async hasPermission(permissionCheckParams: PermissionCheckParams, options: WarrantRequestOptions = {}): Promise<boolean> {
        return this.check({
            object: {
                objectType: ObjectType.Permission,
                objectId: permissionCheckParams.permissionId,
            },
            relation: "member",
            subject: permissionCheckParams.subject,
            context: permissionCheckParams.context,
            debug: permissionCheckParams.debug
        }, options);
    }

    // Private methods
    private static async makeCheckRequest(check: Check, options: WarrantRequestOptions = {}): Promise<boolean> {
        const response = await WarrantClient.httpClient.post({
            url: `/${API_VERSION}/check`,
            data: check,
            options,
        });

        return response.code === 200;
    }

    private static async makeEdgeCheckRequest(check: Check, options: WarrantRequestOptions = {}): Promise<boolean> {
        try {
            const response = await WarrantClient.httpClient.post({
                baseUrl: WarrantClient.config.authorizeEndpoint,
                url: `/${API_VERSION}/check`,
                data: check,
                options,
            });

            return response.code === 200;
        } catch (e) {
            if (e.code === "cache_not_ready") {
                return this.makeCheckRequest(check);
            }

            throw e;
        }
    }

    private static async makeBatchCheckRequest(check: Check, options: WarrantRequestOptions = {}): Promise<boolean[]> {
        const response = await WarrantClient.httpClient.post({
            url: `/${API_VERSION}/check`,
            data: check,
            options,
        });

        return response.map((checkResult: CheckResult) => checkResult.code === 200);
    } 
}
