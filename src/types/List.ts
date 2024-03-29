export interface ListParams {
    prevCursor?: string;
    nextCursor?: string;
    sortBy?: string;
    sortOrder?: string;
    limit?: number;
}

export interface ListResponse<T> {
    results: T[];
    prevCursor?: string;
    nextCursor?: string;
}
