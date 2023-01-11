import ListOptions from "./ListOptions";

export interface ListRoleOptions extends ListOptions { }

export interface CreateRoleParams {
    roleId: string;
    name?: string;
    description?: string;
}

export interface UpdateRoleParams {
    name?: string;
    description?: string;
}
