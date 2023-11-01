import { ListParams } from "./List";

export interface WarrantObject {
    getObjectType(): string;
    getObjectId(): string;
}

export interface WarrantObjectLiteral {
    objectType: string;
    objectId?: string;
}

export function isWarrantObject(object: any): object is WarrantObject {
    return object.getObjectType !== undefined && object.getObjectId !== undefined;
}

export interface CreateObjectParams {
    object: WarrantObject | WarrantObjectLiteral;
    meta?: { [key: string]: any };
}

export interface GetObjectParams {
    object: WarrantObject | WarrantObjectLiteral;
}

export interface ListObjectParams extends ListParams {
    objectType?: string;
    q?: string;
}

export interface UpdateObjectParams {
    meta?: { [key: string]: any };
}

export interface DeleteObjectParams {
    object: WarrantObject | WarrantObjectLiteral;
}

export interface BaseWarrantObject {
    objectType: string;
    objectId: string;
    meta?: { [key: string]: any };
}
