import WarrantClient from "../WarrantClient";
import { API_VERSION } from "../constants";
import { ListResponse } from "../types/List";
import { isWarrantObject, CreateObjectParams, DeleteObjectParams, ListObjectOptions, WarrantObject, WarrantObjectLiteral } from "../types/Object";
import { WarrantRequestOptions } from "../types/WarrantRequestOptions";


export default class ObjectModule {
    //
    // Static methods
    //
    public static async create(params: CreateObjectParams, options: WarrantRequestOptions = {}): Promise<WarrantObjectLiteral> {
        try {
            const testHash = {
                objectType: isWarrantObject(params.object) ? params.object.getObjectType() : params.object.objectType,
                objectId: isWarrantObject(params.object) ? params.object.getObjectId() : params.object.objectId,
                meta: params.meta,
            };
            return await WarrantClient.httpClient.post({
                url: `/${API_VERSION}/objects`,
                data: {
                    objectType: isWarrantObject(params.object) ? params.object.getObjectType() : params.object.objectType,
                    objectId: isWarrantObject(params.object) ? params.object.getObjectId() : params.object.objectId,
                    meta: params.meta,
                },
                options,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async batchCreate(params: CreateObjectParams[], options: WarrantRequestOptions = {}): Promise<WarrantObjectLiteral[]> {
        const mappedObjects = params.map((objectParams: CreateObjectParams) => {
            return {
                objectType: isWarrantObject(objectParams.object) ? objectParams.object.getObjectType() : objectParams.object.objectType,
                objectId: isWarrantObject(objectParams.object) ? objectParams.object.getObjectId() : objectParams.object.objectId,
                meta: objectParams.meta,
            }
        });

        try {
            return await WarrantClient.httpClient.post({
                url: `/${API_VERSION}/objects`,
                data: mappedObjects,
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

    public static async list(listOptions: ListObjectOptions, options: WarrantRequestOptions = {}): Promise<ListResponse<WarrantObjectLiteral>> {
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

    public static async update(object: WarrantObject | WarrantObjectLiteral, meta: { [key: string]: any }, options: WarrantRequestOptions = {}): Promise<WarrantObjectLiteral> {
        try {
            const objectType = isWarrantObject(object) ? object.getObjectType() : object.objectType;
            const objectId = isWarrantObject(object) ? object.getObjectId() : object.objectId;

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

    public static async delete(object: WarrantObject | WarrantObjectLiteral, options: WarrantRequestOptions = {}): Promise<string> {
        try {
            const objectType = isWarrantObject(object) ? object.getObjectType() : object.objectType;
            const objectId = isWarrantObject(object) ? object.getObjectId() : object.objectId;

            const response = await WarrantClient.httpClient.delete({
                url: `/${API_VERSION}/objects/${objectType}/${objectId}`,
                options,
            });

            return response.warrantToken;
        } catch (e) {
            throw e;
        }
    }

    public static async batchDelete(params: DeleteObjectParams[], options: WarrantRequestOptions = {}): Promise<string> {
        try {
            const mappedObjects = params.map((objectParams: CreateObjectParams) => {
                return {
                    objectType: isWarrantObject(objectParams.object) ? objectParams.object.getObjectType() : objectParams.object.objectType,
                    objectId: isWarrantObject(objectParams.object) ? objectParams.object.getObjectId() : objectParams.object.objectId,
                }
            });

            const response = await WarrantClient.httpClient.delete({
                url: `/${API_VERSION}/objects`,
                data: mappedObjects,
                options,
            });

            return response.warrantToken;
        } catch (e) {
            throw e;
        }
    }
}
