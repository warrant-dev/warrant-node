import { ListParams } from "./List";

export interface ListRoleParams extends ListParams { }

export interface CreateRoleParams {
    roleId?: string;
    meta?: { [key: string]: any };
}

export interface ListRoleParams extends ListParams {}

export interface UpdateRoleParams {
    meta?: { [key: string]: any };
}
