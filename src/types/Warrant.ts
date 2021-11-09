import Userset from "./Userset";

export type WarrantUser = Userset | {
    userId: string;
};

export default interface Warrant {
    objectType: string;
    objectId: string;
    relation: string;
    user: WarrantUser;
}
