export interface ResourceEntity {
    id: string;
    title: string;
    url: string;
    type: string;
    description: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface ResourceListQuery {
    search?: string;
    type?: string;
    sortBy?: string;
    sortDir?: string;
    page?: string;
    pageSize?: string;
    includeDeleted?: string;
}