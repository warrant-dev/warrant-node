import ListOptions from "./ListOptions";

export interface ListPermissionOptions extends ListOptions { }

export interface CreatePermissionParams {
    permissionId: string;
    name?: string;
    description?: string;
}

export interface UpdatePermissionParams {
    name?: string;
    description?: string;
}
