import { ListParams } from "./List";

export interface ListPermissionParams extends ListParams { }

export interface CreatePermissionParams {
    permissionId?: string;
    meta?: { [key: string]: any };
}

export interface ListPermissionParams extends ListParams {}

export interface UpdatePermissionParams {
    meta?: { [key: string]: any };
}
