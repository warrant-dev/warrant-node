import WarrantClient from "../WarrantClient";
import { WarrantRequestOptions } from "../types/WarrantRequestOptions";
import Warrant, { isSubject, isWarrantObject, ListWarrantOptions, WarrantParams } from "../types/Warrant";
import { QueryOptions, QueryResponse } from "../types/Query";

export default class WarrantModule {
    public static async create(warrant: WarrantParams, options: WarrantRequestOptions = {}): Promise<Warrant> {
        try {
            return await WarrantClient.httpClient.post({
                url: "/v1/warrants",
                data: {
                    objectType: isWarrantObject(warrant.object) ? warrant.object.getObjectType() : warrant.object.objectType,
                    objectId: isWarrantObject(warrant.object) ? warrant.object.getObjectId() : warrant.object.objectId,
                    relation: warrant.relation,
                    subject: isSubject(warrant.subject) ? warrant.subject : { objectType: warrant.subject.getObjectType(), objectId: warrant.subject.getObjectId() },
                    policy: warrant.policy
                },
                options,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async delete(warrant: WarrantParams, options: WarrantRequestOptions = {}): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: "/v1/warrants",
                data: {
                    objectType: isWarrantObject(warrant.object) ? warrant.object.getObjectType() : warrant.object.objectType,
                    objectId: isWarrantObject(warrant.object) ? warrant.object.getObjectId() : warrant.object.objectId,
                    relation: warrant.relation,
                    subject: isSubject(warrant.subject) ? warrant.subject : { objectType: warrant.subject.getObjectType(), objectId: warrant.subject.getObjectId() },
                    policy: warrant.policy
                },
                options,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async query(query: string, queryOptions: QueryOptions = {}, options: WarrantRequestOptions = {}): Promise<QueryResponse> {
        try {
            return await WarrantClient.httpClient.get({
                url: "/v1/query",
                params: {
                    q: query,
                    ...options,
                },
                options,
            });
        } catch (e) {
            throw e;
        }
    }
}
