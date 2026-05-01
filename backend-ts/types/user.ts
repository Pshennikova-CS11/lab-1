export interface UserEntity {
    id: number;
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