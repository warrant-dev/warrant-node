import ListOptions from "./List";

export interface ListTenantOptions extends ListOptions { }

export interface CreateTenantParams {
    tenantId?: string;
    meta?: { [key: string]: any };
}

export interface DeleteTenantParams {
    tenantId: string;
}
