import { Context, isSubject, Subject, WarrantObject } from "./Warrant";

export interface ForClause {
    object?: WarrantObject;
    relation?: string;
    subject?: Subject | WarrantObject;
    context?: Context;
}

export interface WhereClause {
    object?: WarrantObject;
    relation?: string;
    subject?: Subject | WarrantObject;
    context?: Context;
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

        queryParams["select"] = this.selectClause;

        if (Object.keys(this.forClause).length > 0) {
            let forParamsString: string = "";
            for (const [key, value] of Object.entries(this.forClause)) {
                switch (key) {
                    case 'object':
                        forParamsString += `${key}=${value.getObjectType()}:${value.getObjectId()},`;
                        break;
                    case 'relation':
                        forParamsString += `${key}=${value},`;
                        break;
                    case 'subject':
                        if (isSubject(value)) {
                            if (value.relation) {
                                forParamsString += `${key}=${value.objectType}:${value.objectId}#${value.relation},`;
                            } else {
                                forParamsString += `${key}=${value.objectType}:${value.objectId},`;
                            }
                        } else {
                            forParamsString += `${key}=${value.getObjectType()}:${value.getObjectId()},`;
                        }
                        break;
                    case 'context':
                        let contextString = '';
                        for (const [contextKey, contextValue] of Object.entries(value)) {
                            contextString += `${contextKey}=${contextValue} `;
                        }
                        contextString = contextString.slice(0, -1);
                        forParamsString += `${key}=${contextString},`;
                        break;
                }
            }
            forParamsString = forParamsString.slice(0, -1);

            queryParams["for"] = forParamsString;
        }

        if (Object.keys(this.whereClause).length > 0) {
            let whereParamsString: string = "";
            for (const [key, value] of Object.entries(this.whereClause)) {
                switch (key) {
                    case 'object':
                        whereParamsString += `${key}=${value.getObjectType()}:${value.getObjectId()},`;
                        break;
                    case 'relation':
                        whereParamsString += `${key}=${value},`;
                        break;
                    case 'subject':
                        if (isSubject(value)) {
                            if (value.relation) {
                                whereParamsString += `${key}=${value.objectType}:${value.objectId}#${value.relation},`;
                            } else {
                                whereParamsString += `${key}=${value.objectType}:${value.objectId},`;
                            }
                        } else {
                            whereParamsString += `${key}=${value.getObjectType()}:${value.getObjectId()},`;
                        }
                        break;
                    case 'context':
                        let contextString = '';
                        for (const [contextKey, contextValue] of Object.entries(value)) {
                            contextString += `${contextKey}=${contextValue} `;
                        }
                        contextString = contextString.slice(0, -1);
                        whereParamsString += `${key}=${contextString},`;
                        break;
                }
            }
            whereParamsString = whereParamsString.slice(0, -1);

            queryParams["where"] = whereParamsString;
        }

        return queryParams;
    }
}
