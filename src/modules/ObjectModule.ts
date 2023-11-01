import WarrantClient from "../WarrantClient";
import { API_VERSION } from "../constants";
import { ListResponse } from "../types";
import {
    isWarrantObject,
    CreateObjectParams,
    GetObjectParams,
    ListObjectParams,
    UpdateObjectParams,
    DeleteObjectParams,
    BaseWarrantObject,
} from "../types/Object";
import { WarrantRequestOptions } from "../types/WarrantRequestOptions";


export default class ObjectModule {
    //
    // Static methods
    //
    public static async create(params: CreateObjectParams, options: WarrantRequestOptions = {}): Promise<BaseWarrantObject> {
        return await WarrantClient.httpClient.post({
            url: `/${API_VERSION}/objects`,
            data: {
                objectType: isWarrantObject(params.object) ? params.object.getObjectType() : params.object.objectType,
                objectId: isWarrantObject(params.object) ? params.object.getObjectId() : params.object.objectId,
                meta: params.meta,
            },
            options,
        });
    }

    public static async batchCreate(params: CreateObjectParams[], options: WarrantRequestOptions = {}): Promise<BaseWarrantObject[]> {
        return await WarrantClient.httpClient.post({
            url: `/${API_VERSION}/objects`,
            data: params.map((objectParams: CreateObjectParams) => ({
                objectType: isWarrantObject(objectParams.object) ? objectParams.object.getObjectType() : objectParams.object.objectType,
                objectId: isWarrantObject(objectParams.object) ? objectParams.object.getObjectId() : objectParams.object.objectId,
                meta: objectParams.meta,
            })),
            options,
        });
    }

    public static async get(params: GetObjectParams, options: WarrantRequestOptions = {}): Promise<BaseWarrantObject> {
        const objectType = isWarrantObject(params.object) ? params.object.getObjectType() : params.object.objectType;
        const objectId = isWarrantObject(params.object) ? params.object.getObjectId() : params.object.objectId;

        return await WarrantClient.httpClient.get({
            url: `/${API_VERSION}/objects/${objectType}/${objectId}`,
            options,
        });
    }

    public static async list(listParams: ListObjectParams, options: WarrantRequestOptions = {}): Promise<ListResponse<BaseWarrantObject>> {
        return await WarrantClient.httpClient.get({
            url: `/${API_VERSION}/objects`,
            params: listParams,
            options,
        });
    }

    public static async update(params: UpdateObjectParams, options: WarrantRequestOptions = {}): Promise<BaseWarrantObject> {
        const objectType = isWarrantObject(params.object) ? params.object.getObjectType() : params.object.objectType;
        const objectId = isWarrantObject(params.object) ? params.object.getObjectId() : params.object.objectId;

        return await WarrantClient.httpClient.put({
            url: `/${API_VERSION}/objects/${objectType}/${objectId}`,
            data: {
                meta: params.meta,
            },
            options,
        });
    }

    public static async delete(params: DeleteObjectParams, options: WarrantRequestOptions = {}): Promise<string> {
        const objectType = isWarrantObject(params.object) ? params.object.getObjectType() : params.object.objectType;
        const objectId = isWarrantObject(params.object) ? params.object.getObjectId() : params.object.objectId;

        const response = await WarrantClient.httpClient.delete({
            url: `/${API_VERSION}/objects/${objectType}/${objectId}`,
            options,
        });

        return response.warrantToken;
    }

    public static async batchDelete(params: DeleteObjectParams[], options: WarrantRequestOptions = {}): Promise<string> {
        const response = await WarrantClient.httpClient.delete({
            url: `/${API_VERSION}/objects`,
            data: params.map((objectParams: CreateObjectParams) => ({
                objectType: isWarrantObject(objectParams.object) ? objectParams.object.getObjectType() : objectParams.object.objectType,
                objectId: isWarrantObject(objectParams.object) ? objectParams.object.getObjectId() : objectParams.object.objectId,
            })),
            options,
        });

        return response.warrantToken;
    }
}
