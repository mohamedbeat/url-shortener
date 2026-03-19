
// pagination type compatible with useInfiniteQuery from @tanstack/react-query
export type Pagination<T> = {
  data: T[];
  pagination: {
    currentPage: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean
  }
}

export type SortOrder = 'ASC' | 'DESC'
export type LinkSortFields = 'createdAt' | 'totalClicks' 