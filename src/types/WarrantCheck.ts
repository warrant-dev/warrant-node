import Warrant from "./Warrant";

export enum WarrantCheckOp {
    AllOf = "allOf",
    AnyOf = "anyOf",
}

export default interface WarrantCheck {
    op?: WarrantCheckOp;
    warrants: Warrant[];
    consistentRead?: boolean;
    debug?: boolean;
}
