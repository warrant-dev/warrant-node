import { Warrant, PolicyContext } from "./Warrant";
import { ListParams } from "./List";

export interface QueryParams {
    query: string;
    context?: PolicyContext;
}

export interface QueryResult {
    objectType: string;
    objectId: string;
    warrant: Warrant;
    isImplicit: boolean;
    meta?: { [key: string]: any; };
}

export interface QueryListParams extends ListParams {}
