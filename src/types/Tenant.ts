import { ListParams } from "./List";

export interface ListTenantParams extends ListParams { }

export interface CreateTenantParams {
    tenantId?: string;
    meta?: { [key: string]: any };
}

export interface ListTenantParams extends ListParams {}

export interface UpdateTenantParams {
    meta?: { [key: string]: any };
}

export interface DeleteTenantParams {
    tenantId: string;
}
