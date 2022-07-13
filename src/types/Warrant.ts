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
