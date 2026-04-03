export interface RatingEntity {
    id: string;
    resourceId: string;
    userId: string;
    value: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface RatingListQuery {
    resourceId?: string;
    userId?: string;
    value?: string;
    sortBy?: string;
    sortDir?: string;
    page?: string;
    pageSize?: string;
    includeDeleted?: string;
}