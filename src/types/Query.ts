import Warrant from "./Warrant";

export interface QueryOptions {
    lastId?: string;
}

export interface QueryResponse {
    results: QueryResult[];
    lastId?: string;
}

export interface QueryResult {
    objectType: string;
    objectId: string;
    warrant: Warrant;
    isImplicit: boolean;
    meta: { [key: string]: any; };
}
