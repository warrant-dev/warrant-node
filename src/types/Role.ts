import ListOptions from "./ListOptions";

export interface ListRoleOptions extends ListOptions { }

export interface CreateRoleParams {
    roleId?: string;
    meta?: { [key: string]: any };
}

