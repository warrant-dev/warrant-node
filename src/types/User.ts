import ListOptions from "./ListOptions";

export interface ListUserOptions extends ListOptions { }

export interface CreateUserParams {
    userId?: string;
    email?: string;
}

export interface UpdateUserParams {
    email?: string;
}
