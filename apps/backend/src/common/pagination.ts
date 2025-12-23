export type PaginationOptions = {
  page?: number;
  limit?: number;
};

export const normalizePagination = (
  page?: number,
  limit?: number,
  maxLimit = 100,
) => {
  if (!page || !limit) return null;
  const safeLimit = Math.min(Math.max(limit, 1), maxLimit);
  const safePage = Math.max(page, 1);
  return {
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
  };
};
