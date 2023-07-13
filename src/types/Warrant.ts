import ListOptions from "./ListOptions";

export interface ListWarrantOptions extends ListOptions {
    objectType?: string;
    objectId?: string;
    relation?: string;
    userId?: string;
}

export interface PolicyContext {
    [key: string]: any;
}

export interface Subject {
    objectType: string;
    objectId: string;
    relation?: string;
}

export function isSubject(object: any): object is Subject {
    return Object.prototype.hasOwnProperty.call(object, "objectType")
        && Object.prototype.hasOwnProperty.call(object, "objectId")
}

export default interface Warrant {
    objectType: string;
    objectId: string;
    relation: string;
    subject: Subject;
    policy?: string;
}

export interface WarrantObject {
    getObjectType(): string;
    getObjectId(): string;
}

export function isWarrantObject(object: any): object is WarrantObject {
    return object.getObjectType !== undefined && object.getObjectId !== undefined;
}

export interface WarrantObjectLiteral {
    objectType: string;
    objectId: string;
}

export interface WarrantParams {
    object: WarrantObject | WarrantObjectLiteral;
    relation: string;
    subject: WarrantObject | Subject;
    policy?: string;
}
