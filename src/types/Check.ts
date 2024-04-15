import {
    isWarrantObject,
    WarrantObject,
    WarrantObjectLiteral,
} from "./Object";
import {
    isSubject,
    PolicyContext,
    Subject,
} from "./Warrant";

export enum CheckOp {
    AllOf = "allOf",
    AnyOf = "anyOf",
    Batch = "batch",
}

export interface CheckWarrantParams {
    object: WarrantObject | WarrantObjectLiteral;
    relation: string;
    subject: WarrantObject | Subject;
    context?: PolicyContext;
}

export interface CheckParams extends CheckWarrantParams {
    debug?: boolean;
}

export interface CheckManyParams {
    op?: CheckOp;
    warrants: CheckWarrantParams[];
    debug?: boolean;
}

export interface BatchCheckParams {
    warrants: CheckWarrantParams[];
    debug?: boolean;
}

export interface FeatureCheckParams {
    featureId: string;
    subject: WarrantObject | Subject;
    context?: PolicyContext;
    debug?: boolean;
}

export interface PermissionCheckParams {
    permissionId: string;
    subject: WarrantObject | Subject;
    context?: PolicyContext;
    debug?: boolean;
}

export interface CheckWarrant {
    objectType: string;
    objectId: string;
    relation: string;
    subject: Subject;
    context: PolicyContext;
}

export interface Check {
    op?: CheckOp;
    warrants: CheckWarrant[];
    debug?: boolean;
}

export function checkWarrantParamsToCheckWarrant(checkWarrantParams: CheckWarrantParams): CheckWarrant {
    return {
        objectType: isWarrantObject(checkWarrantParams.object) ? checkWarrantParams.object.getObjectType() : checkWarrantParams.object.objectType,
        objectId: isWarrantObject(checkWarrantParams.object) ? checkWarrantParams.object.getObjectId() : checkWarrantParams.object.objectId,
        relation: checkWarrantParams.relation,
        subject: isSubject(checkWarrantParams.subject) ? checkWarrantParams.subject : { objectType: checkWarrantParams.subject.getObjectType(), objectId: checkWarrantParams.subject.getObjectId() },
        context: checkWarrantParams.context
    }
}

export interface CheckResult {
    code?: number;
    result: string;
    isImplicit: boolean;
}
