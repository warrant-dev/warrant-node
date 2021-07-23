import User from "./User";
import Userset from "./Userset";

export default interface Warrant {
    objectType: string;
    objectId: string;
    relation: string;
    user: User | Userset;
}
