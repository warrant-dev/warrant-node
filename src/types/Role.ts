import ListOptions from "./List";

export interface ListRoleOptions extends ListOptions { }

export interface CreateRoleParams {
    roleId?: string;
    meta?: { [key: string]: any };
}

