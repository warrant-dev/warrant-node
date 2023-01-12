import Warrant, { Context, Subject, WarrantObject, WarrantObjectLiteral } from "./Warrant";

export enum CheckOp {
    AllOf = "allOf",
    AnyOf = "anyOf",
}

export interface CheckWarrant {
    object: WarrantObject | WarrantObjectLiteral;
    relation: string;
    subject: WarrantObject | Subject;
    context?: Context;
}

export default interface Check extends CheckWarrant {
    consistentRead?: boolean;
    debug?: boolean;
}

export interface CheckMany {
    op?: CheckOp;
    warrants: CheckWarrant[];
    consistentRead?: boolean;
    debug?: boolean;
}

export interface FeatureCheck {
    featureId: string;
    subject: WarrantObject | Subject;
    context?: Context;
    consistentRead?: boolean;
    debug?: boolean;
}

export interface PermissionCheck {
    permissionId: string;
    subject: WarrantObject | Subject;
    context?: Context;
    consistentRead?: boolean;
    debug?: boolean;
}

export interface AccessCheckRequest {
    op?: CheckOp;
    warrants: Warrant[];
    consistentRead?: boolean;
    debug?: boolean;
}
