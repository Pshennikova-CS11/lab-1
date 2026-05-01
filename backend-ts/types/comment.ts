export interface CommentEntity {
    id: number;
    resourceId: number;
    userId: number;
    text: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface CommentListQuery {
    resourceId?: string;
    userId?: string;
    search?: string;
    sortBy?: string;
    sortDir?: string;
    page?: string;
    pageSize?: string;
    includeDeleted?: string;
}