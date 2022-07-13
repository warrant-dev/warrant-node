import Warrant from "./Warrant";

export enum ConsistencyModel {
    EventuallyConsistent = "eventuallyConsistent",
    ImmediatelyConsistent = "immediatelyConsistent",
}

export enum WarrantCheckOp {
    AllOf = "allOf",
    AnyOf = "anyOf",
}

export default interface WarrantCheck {
    op?: WarrantCheckOp;
    warrants: Warrant[];
    consistency?: ConsistencyModel;
    debug?: boolean;
}
