import { ListParams } from "./List";

export interface ListRoleParams extends ListParams { }

export interface CreateRoleParams {
    roleId?: string;
    meta?: { [key: string]: any };
}

export interface GetRoleParams {
    roleId: string;
}

export interface ListRoleParams extends ListParams {}

export interface UpdateRoleParams {
    roleId: string;
    meta: { [key: string]: any };
}

export interface DeleteRoleParams {
    roleId: string;
}
