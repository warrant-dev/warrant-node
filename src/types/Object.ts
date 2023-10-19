import ListOptions from "./ListOptions";

export interface WarrantObject {
    getObjectType(): string;
    getObjectId(): string;
}

export interface WarrantObjectLiteral {
    objectType: string;
    objectId: string;
    meta?: { [key: string]: any };
}

export function isWarrantObject(object: any): object is WarrantObject {
    return object.getObjectType !== undefined && object.getObjectId !== undefined;
}

export interface CreateObjectParams {
    objectType: string;
    objectId?: string;
    meta?: { [key: string]: any };
}

export interface ListObjectOptions extends ListOptions {
    objectType?: string;
    objectId?: string;
}

export interface DeleteObjectParams {
    objectType: string;
    objectId: string;
}
