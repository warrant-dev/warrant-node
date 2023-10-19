import Warrant from "./Warrant";

export interface QueryResponse {
    results: QueryResult[];
    prevCursor?: string;
    nextCursor?: string;
}

export interface QueryResult {
    objectType: string;
    objectId: string;
    warrant: Warrant;
    isImplicit: boolean;
    meta: { [key: string]: any; };
}
