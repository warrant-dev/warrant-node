import ListOptions from "./List";
import { WarrantObject, WarrantObjectLiteral } from "./Object";

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
    warrantToken?: string;
}

export interface WarrantParams {
    object: WarrantObject | WarrantObjectLiteral;
    relation: string;
    subject: WarrantObject | Subject;
    policy?: string;
}
