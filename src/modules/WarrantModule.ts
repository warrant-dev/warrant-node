import WarrantClient from "../WarrantClient";
import Query from "../types/Query";
import Warrant, { ListWarrantOptions } from "../types/Warrant";

export default class WarrantModule {
    public static async create(warrant: Warrant): Promise<Warrant> {
        try {
            return await WarrantClient.httpClient.post({
                url: "/v1/warrants",
                data: warrant,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async delete(warrant: Warrant): Promise<void> {
        try {
            return await WarrantClient.httpClient.delete({
                url: "/v1/warrants",
                data: warrant,
            });
        } catch (e) {
            throw e;
        }
    }

    public static async queryWarrants(query: Query, listOptions: ListWarrantOptions = {}): Promise<Warrant[]> {
        try {
            return await WarrantClient.httpClient.get({
                url: "/v1/query",
                params: {
                    ...query.toObject(),
                    ...listOptions
                },
            });
        } catch (e) {
            throw e;
        }
    }
}
