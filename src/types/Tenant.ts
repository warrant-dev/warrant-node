import ListOptions from "./ListOptions";

export interface ListTenantOptions extends ListOptions { }

export default interface Tenant {
    tenantId?: string;
    name?: string;
}
