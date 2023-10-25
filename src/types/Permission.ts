import ListOptions from "./List";

export interface ListPermissionOptions extends ListOptions { }

export interface CreatePermissionParams {
    permissionId?: string;
    meta?: { [key: string]: any };
}
