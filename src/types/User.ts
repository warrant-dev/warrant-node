import ListOptions from "./ListOptions";

export interface ListUserOptions extends ListOptions { }

export default interface User {
    userId?: string;
    email?: string;
}
