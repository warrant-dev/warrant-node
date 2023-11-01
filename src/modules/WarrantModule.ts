import WarrantClient from "../WarrantClient";
import { API_VERSION } from "../constants";
import {
    ListResponse,
    ListWarrantParams,
    QueryListParams,
    QueryResult,
    Warrant,
    WarrantParams,
} from "../types";
import { isWarrantObject } from "../types/Object";
import { isSubject } from "../types/Warrant";
import { WarrantRequestOptions } from "../types/WarrantRequestOptions";

export default class WarrantModule {
    public static async create(params: WarrantParams, options: WarrantRequestOptions = {}): Promise<Warrant> {
        return await WarrantClient.httpClient.post({
            url: `/${API_VERSION}/warrants`,
            data: {
                objectType: isWarrantObject(params.object) ? params.object.getObjectType() : params.object.objectType,
                objectId: isWarrantObject(params.object) ? params.object.getObjectId() : params.object.objectId,
                relation: params.relation,
                subject: isSubject(params.subject) ? params.subject : { objectType: params.subject.getObjectType(), objectId: params.subject.getObjectId() },
                policy: params.policy
            },
            options,
        });
    }

    public static async batchCreate(params: WarrantParams[], options: WarrantRequestOptions = {}): Promise<Warrant[]> {
        return await WarrantClient.httpClient.post({
            url: `/${API_VERSION}/warrants`,
            data: params.map((warrant: WarrantParams) => ({
                objectType: isWarrantObject(warrant.object) ? warrant.object.getObjectType() : warrant.object.objectType,
                objectId: isWarrantObject(warrant.object) ? warrant.object.getObjectId() : warrant.object.objectId,
                relation: warrant.relation,
                subject: isSubject(warrant.subject) ? warrant.subject : { objectType: warrant.subject.getObjectType(), objectId: warrant.subject.getObjectId() },
                policy: warrant.policy,
            })),
            options,
        });
    }

    public static async list(params: ListWarrantParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<Warrant>> {
        return await WarrantClient.httpClient.get({
            url: `/${API_VERSION}/warrants`,
            params,
            options,
        });
    }

    public static async query(query: string, listParams: QueryListParams = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<QueryResult>> {
        return await WarrantClient.httpClient.get({
            url: `/${API_VERSION}/query`,
            params: {
                q: query,
                ...listParams,
            },
            options,
        });
    }

    public static async delete(params: WarrantParams, options: WarrantRequestOptions = {}): Promise<string> {
        const response = await WarrantClient.httpClient.delete({
            url: `/${API_VERSION}/warrants`,
            data: {
                objectType: isWarrantObject(params.object) ? params.object.getObjectType() : params.object.objectType,
                objectId: isWarrantObject(params.object) ? params.object.getObjectId() : params.object.objectId,
                relation: params.relation,
                subject: isSubject(params.subject) ? params.subject : { objectType: params.subject.getObjectType(), objectId: params.subject.getObjectId() },
                policy: params.policy
            },
            options,
        });
        return response.warrantToken;
    }

    public static async batchDelete(params: WarrantParams[], options: WarrantRequestOptions = {}): Promise<void> {
        const response = await WarrantClient.httpClient.delete({
            url: `/${API_VERSION}/warrants`,
            data: params.map((warrant: WarrantParams) => ({
                objectType: isWarrantObject(warrant.object) ? warrant.object.getObjectType() : warrant.object.objectType,
                objectId: isWarrantObject(warrant.object) ? warrant.object.getObjectId() : warrant.object.objectId,
                relation: warrant.relation,
                subject: isSubject(warrant.subject) ? warrant.subject : { objectType: warrant.subject.getObjectType(), objectId: warrant.subject.getObjectId() },
                policy: warrant.policy,
            })),
            options,
        });
        return response.warrantToken;
    }
}
