import { Context } from "./Warrant";

export interface SessionParams {
    userId: string;
    tenantId?: string;
    ttl?: number;
    context?: Context;
}

export interface SelfServiceSessionParams extends SessionParams {
    selfServiceStrategy: "basic" | "advanced";
}
