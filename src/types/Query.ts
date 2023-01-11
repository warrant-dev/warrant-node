import { Subject, WarrantObject } from "./Warrant";

export interface ForClause {
    object?: WarrantObject;
    relation?: string;
    subject?: Subject | WarrantObject;
}

export interface WhereClause {
    object?: WarrantObject;
    relation?: string;
    subject?: Subject | WarrantObject;
}

export default class Query {
    selectClause: string;
    forClause: ForClause;
    whereClause: WhereClause;

    constructor(selectClause: string, forClause: ForClause = {}, whereClause: WhereClause = {}) {
        this.selectClause = selectClause;
        this.forClause = forClause;
        this.whereClause = whereClause;
    }

    public static selectWarrants(): Query {
        return new Query("warrants");
    }

    public static selectExplicitWarrants(): Query {
        return new Query("explicit warrants");
    }

    public for(forClause: ForClause): Query {
        this.forClause = forClause;

        return this;
    }

    public where(whereClause: WhereClause): Query {
        this.whereClause = whereClause;

        return this;
    }

    public toObject(): Object {
        let queryParams: { [key: string]: string } = {};

        queryParams["select"] = `select=${this.selectClause}`;

        if (Object.keys(this.forClause).length > 0) {
            let forParamsString: string = "";
            for (const [key, value] of Object.entries(this.forClause)) {
                forParamsString += `${key}=${value},`;
            }
            forParamsString = forParamsString.slice(0, -1);

            queryParams["for"] = `for=${forParamsString}`;
        }

        if (Object.keys(this.whereClause).length > 0) {
            let whereParamsString: string = "";
            for (const [key, value] of Object.entries(this.whereClause)) {
                whereParamsString += `${key}=${value},`;
            }
            whereParamsString = whereParamsString.slice(0, -1);

            queryParams["where"] = `where=${whereParamsString}`;
        }

        return queryParams;
    }
}
