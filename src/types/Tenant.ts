import ListOptions from "./ListOptions";

export interface ListTenantOptions extends ListOptions { }

export interface CreateTenantParams {
    tenantId?: string;
    name?: string;
}

export interface UpdateTenantParams {
    name?: string;
}
