import WarrantClient from "../WarrantClient";
import { API_VERSION } from "../constants";
import { CreateObjectParams, DeleteObjectParams, ListObjectOptions, WarrantObjectLiteral } from "../types/Object";
import { WarrantRequestOptions } from "../types/WarrantRequestOptions";

export interface ListObjectsResult {
    results: WarrantObjectLiteral[];
    prevCursor?: string;
    nextCursor?: string;
}

export default class ObjectModule {
    //
    // Static methods
    //
    public static async create(object: CreateObjectParams, options: WarrantRequestOptions = {}): Promise<WarrantObjectLiteral> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/${API_VERSION}/objects`,
                data: object,
                options,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async batchCreate(objects: CreateObjectParams[], options: WarrantRequestOptions = {}): Promise<WarrantObjectLiteral[]> {
        try {
            return await WarrantClient.httpClient.post({
                url: `/${API_VERSION}/objects`,
                data: objects,
                options,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async get(objectType: string, objectId: string, options: WarrantRequestOptions = {}): Promise<WarrantObjectLiteral> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/${API_VERSION}/objects/${objectType}/${objectId}`,
                options,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async list(listOptions: ListObjectOptions, options: WarrantRequestOptions = {}): Promise<ListObjectsResult> {
        try {
            return await WarrantClient.httpClient.get({
                url: `/${API_VERSION}/objects`,
                params: listOptions,
                options,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async update(objectType: string, objectId: string, meta: { [key: string]: any }, options: WarrantRequestOptions = {}): Promise<WarrantObjectLiteral> {
        try {
            return await WarrantClient.httpClient.put({
                url: `/${API_VERSION}/objects/${objectType}/${objectId}`,
                data: {
                    meta,
                },
                options,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async delete(objectType: string, objectId: string, options: WarrantRequestOptions = {}): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/${API_VERSION}/objects/${objectType}/${objectId}`,
                options,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async batchDelete(objects: DeleteObjectParams[], options: WarrantRequestOptions = {}): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: `/${API_VERSION}/objects`,
                data: objects,
                options,
            });
        } catch (e) {
            throw e;
        }
    }
}
