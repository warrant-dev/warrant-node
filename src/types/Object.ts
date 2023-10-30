import ListOptions from "./List";

export interface WarrantObject {
    getObjectType(): string;
    getObjectId(): string;
}

export interface WarrantObjectLiteral {
    objectType: string;
    objectId: string;
    meta?: { [key: string]: any };
}

export interface CreateWarrantObjectLiteral {
    objectType: string;
    objectId?: string;
    meta?: { [key: string]: any };
}

export function isWarrantObject(object: any): object is WarrantObject {
    return object.getObjectType !== undefined && object.getObjectId !== undefined;
}

export interface CreateObjectParams {
    object: WarrantObject | CreateWarrantObjectLiteral;
    meta?: { [key: string]: any };
}

export interface ListObjectOptions extends ListOptions {
    objectType?: string;
    q?: string;
}

export interface DeleteObjectParams {
    object: WarrantObject | WarrantObjectLiteral;
}
