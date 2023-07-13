import { PolicyContext } from "./Warrant";

export interface SessionParams {
    userId: string;
    ttl?: number;
    context?: PolicyContext;
}

export interface SelfServiceSessionParams extends SessionParams {
    tenantId: string;
    selfServiceStrategy: SelfServiceStrategy;
}

export enum SelfServiceStrategy {
    RBAC = "rbac",
    FGAC = "fgac",
}
