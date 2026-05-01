export interface ResourceEntity {
    id: number;
    title: string;
    url: string;
    type: string;
    description?: string;
    author: string;
    createdAt: string;
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