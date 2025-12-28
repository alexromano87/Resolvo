"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePagination = exports.DEFAULT_PAGINATION_LIMIT = void 0;
exports.DEFAULT_PAGINATION_LIMIT = 50;
const normalizePagination = (page, limit, maxLimit = 100, defaultLimit = exports.DEFAULT_PAGINATION_LIMIT) => {
    const safeLimit = Math.min(Math.max(limit ?? defaultLimit, 1), maxLimit);
    const safePage = Math.max(page ?? 1, 1);
    return {
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
    };
};
exports.normalizePagination = normalizePagination;
//# sourceMappingURL=pagination.js.map