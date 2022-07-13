import ListOptions from "./ListOptions";

export interface ListWarrantOptions extends ListOptions {
    objectType?: string;
    objectId?: string;
    relation?: string;
    userId?: string;
}

export interface Subject {
    objectType: string;
    objectId: string;
    relation?: string;
}

export default interface Warrant {
    objectType: string;
    objectId: string;
    relation: string;
    subject: Subject;
}
