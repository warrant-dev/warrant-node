export default class Query {
    selectClause: string;
    forClauses: Object;
    whereClauses: Object;

    constructor(selectClause: string, forClauses: Object = {}, whereClauses: Object = {}) {
        this.selectClause = selectClause;
        this.forClauses = forClauses;
        this.whereClauses = whereClauses;
    }

    public static selectWarrants(): Query {
        return new Query("warrants");
    }

    public static selectExplicitWarrants(): Query {
        return new Query("explicit warrants");
    }

    public for(forClauses: Object): Query {
        this.forClauses = forClauses;

        return this;
    }

    public where(whereClauses: Object): Query {
        this.whereClauses = whereClauses;

        return this;
    }

    public toObject(): Object {
        let queryParams: { [key: string]: string } = {};

        queryParams["select"] = `select=${this.selectClause}`;

        if (Object.keys(this.forClauses).length > 0) {
            let forParamsString: string = "";
            for (const [key, value] of Object.entries(this.forClauses)) {
                forParamsString += `${key}=${value},`;
            }
            forParamsString = forParamsString.slice(0, -1);

            queryParams["for"] = `for=${forParamsString}`;
        }

        if (Object.keys(this.whereClauses).length > 0) {
            let whereParamsString: string = "";
            for (const [key, value] of Object.entries(this.whereClauses)) {
                whereParamsString += `${key}=${value},`;
            }
            whereParamsString = whereParamsString.slice(0, -1);

            queryParams["where"] = `where=${whereParamsString}`;
        }

        return queryParams;
    }
}
