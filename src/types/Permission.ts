import { ListParams } from "./List";

export interface ListPermissionParams extends ListParams { }

export interface CreatePermissionParams {
    permissionId?: string;
    meta?: { [key: string]: any };
}

export interface GetPermissionParams {
    permissionId: string;
}

export interface ListPermissionParams extends ListParams {}

export interface UpdatePermissionParams {
    permissionId: string;
    meta: { [key: string]: any };
}

export interface DeletePermissionParams {
    permissionId: string;
}
