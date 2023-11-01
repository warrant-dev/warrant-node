import { ListParams } from "./List";

export interface ListUserParams extends ListParams { }

export interface CreateUserParams {
    userId?: string;
    meta?: { [key: string]: any };
}

export interface GetUserParams {
    userId: string;
}

export interface ListUserParams extends ListParams {}

export interface UpdateUserParams {
    userId: string;
    meta: { [key: string]: any };
}

export interface DeleteUserParams {
    userId: string;
}
