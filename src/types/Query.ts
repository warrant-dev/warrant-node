import Warrant from "./Warrant";

export interface QueryResult {
    objectType: string;
    objectId: string;
    warrant: Warrant;
    isImplicit: boolean;
    meta: { [key: string]: any; };
}
