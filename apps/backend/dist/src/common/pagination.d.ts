export type PaginationOptions = {
    page?: number;
    limit?: number;
};
export declare const DEFAULT_PAGINATION_LIMIT = 50;
export declare const normalizePagination: (page?: number, limit?: number, maxLimit?: number, defaultLimit?: number) => {
    skip: number;
    take: number;
};
