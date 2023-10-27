import WarrantClient from "../WarrantClient";
import { API_VERSION } from "../constants";
import ListOptions, { ListResponse } from "../types/List";
import { isWarrantObject } from "../types/Object";
import { QueryResult } from "../types/Query";
import Warrant, { isSubject, WarrantParams } from "../types/Warrant";
import { WarrantRequestOptions } from "../types/WarrantRequestOptions";

export default class WarrantModule {
    public static async create(warrant: WarrantParams, options: WarrantRequestOptions = {}): Promise<Warrant> {
        try {
            const response = await WarrantClient.httpClient.post({
                url: `/${API_VERSION}/warrants`,
                data: {
                    objectType: isWarrantObject(warrant.object) ? warrant.object.getObjectType() : warrant.object.objectType,
                    objectId: isWarrantObject(warrant.object) ? warrant.object.getObjectId() : warrant.object.objectId,
                    relation: warrant.relation,
                    subject: isSubject(warrant.subject) ? warrant.subject : { objectType: warrant.subject.getObjectType(), objectId: warrant.subject.getObjectId() },
                    policy: warrant.policy
                },
                options,
            });

            return response;
        } catch (e) {
            throw e;
        }
    }

    public static async batchCreate(warrants: WarrantParams[], options: WarrantRequestOptions = {}): Promise<Warrant[]> {
        try {
            const mappedWarrants = warrants.map((warrant: WarrantParams) => {
                return {
                    objectType: isWarrantObject(warrant.object) ? warrant.object.getObjectType() : warrant.object.objectType,
                    objectId: isWarrantObject(warrant.object) ? warrant.object.getObjectId() : warrant.object.objectId,
                    relation: warrant.relation,
                    subject: isSubject(warrant.subject) ? warrant.subject : { objectType: warrant.subject.getObjectType(), objectId: warrant.subject.getObjectId() },
                    policy: warrant.policy,
                }
            });

            return await WarrantClient.httpClient.post({
                url: `/${API_VERSION}/warrants`,
                data: mappedWarrants,
                options,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async delete(warrant: WarrantParams, options: WarrantRequestOptions = {}): Promise<string> {
        try {
            const response = await WarrantClient.httpClient.delete({
                url: `/${API_VERSION}/warrants`,
                data: {
                    objectType: isWarrantObject(warrant.object) ? warrant.object.getObjectType() : warrant.object.objectType,
                    objectId: isWarrantObject(warrant.object) ? warrant.object.getObjectId() : warrant.object.objectId,
                    relation: warrant.relation,
                    subject: isSubject(warrant.subject) ? warrant.subject : { objectType: warrant.subject.getObjectType(), objectId: warrant.subject.getObjectId() },
                    policy: warrant.policy
                },
                options,
            });

            return response.warrantToken;
        } catch (e) {
            throw e;
        }
    }

    public static async batchDelete(warrants: WarrantParams[], options: WarrantRequestOptions = {}): Promise<void> {
        try {
            const mappedWarrants = warrants.map((warrant: WarrantParams) => {
                return {
                    objectType: isWarrantObject(warrant.object) ? warrant.object.getObjectType() : warrant.object.objectType,
                    objectId: isWarrantObject(warrant.object) ? warrant.object.getObjectId() : warrant.object.objectId,
                    relation: warrant.relation,
                    subject: isSubject(warrant.subject) ? warrant.subject : { objectType: warrant.subject.getObjectType(), objectId: warrant.subject.getObjectId() },
                    policy: warrant.policy,
                }
            });

            return await WarrantClient.httpClient.delete({
                url: `/${API_VERSION}/warrants`,
                data: mappedWarrants,
                options,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async query(query: string, listOptions: ListOptions = {}, options: WarrantRequestOptions = {}): Promise<ListResponse<QueryResult>> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/${API_VERSION}/query`,
                params: {
                    q: query,
                    ...listOptions,
                },
                options,
            });
        } catch (e) {
            throw e;
        }
    }
}
