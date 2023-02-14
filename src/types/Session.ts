import { Context } from "./Warrant";

export interface SessionParams {
    userId: string;
    ttl?: number;
    context?: Context;
}

export interface SelfServiceSessionParams extends SessionParams {
    tenantId: string;
    selfServiceStrategy: SelfServiceStrategy;
}

export enum SelfServiceStrategy {
    RBAC = "rbac",
    FGAC = "fgac",
}
