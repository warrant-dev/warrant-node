import ListOptions from "./ListOptions";

export interface ListUserOptions extends ListOptions { }

export interface CreateUserParams {
    userId?: string;
    meta?: { [key: string]: any };
}

export interface DeleteUserParams {
    userId: string;
}
