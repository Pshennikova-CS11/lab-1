export interface UserEntity {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface UserListQuery {
    search?: string;
    page?: string;
    pageSize?: string;
    includeDeleted?: string;
}