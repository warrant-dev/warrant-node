import Warrant, { PolicyContext, Subject, WarrantObject, WarrantObjectLiteral } from "./Warrant";

export enum CheckOp {
    AllOf = "allOf",
    AnyOf = "anyOf",
}

export interface CheckWarrant {
    object: WarrantObject | WarrantObjectLiteral;
    relation: string;
    subject: WarrantObject | Subject;
    context?: PolicyContext;
}

export default interface Check extends CheckWarrant {
    debug?: boolean;
}

export interface CheckMany {
    op?: CheckOp;
    warrants: CheckWarrant[];
    debug?: boolean;
}

export interface FeatureCheck {
    featureId: string;
    subject: WarrantObject | Subject;
    context?: PolicyContext;
    debug?: boolean;
}

export interface PermissionCheck {
    permissionId: string;
    subject: WarrantObject | Subject;
    context?: PolicyContext;
    debug?: boolean;
}

export interface CheckWarrantRequest {
    objectType: string;
    objectId: string;
    relation: string;
    subject: WarrantObject | Subject;
    context?: PolicyContext;
}

export interface AccessCheckRequest {
    op?: CheckOp;
    warrants: CheckWarrantRequest[];
    debug?: boolean;
}
