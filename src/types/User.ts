import { ListParams } from "./List";

export interface ListUserParams extends ListParams { }

export interface CreateUserParams {
    userId?: string;
    meta?: { [key: string]: any };
}

export interface ListUserParams extends ListParams {}

export interface UpdateUserParams {
    meta?: { [key: string]: any };
}

export interface DeleteUserParams {
    userId: string;
}
