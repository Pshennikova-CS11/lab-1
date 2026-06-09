export interface ApiItemResponse<T> {
    item: T;
}

export interface ApiListResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}

export interface ApiErrorResponse {
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
}

/* RESOURCES */

export type BackendResourceDto = {
    id: number;
    title: string;
    url: string;
    type: string;
    description: string;
    author: string;
    createdAt: string;
    updatedAt?: string;
};

export type BackendCreateResourceDto = {
    title: string;
    url: string;
    type: string;
    description?: string;
    author: string;
};

export type BackendPatchResourceDto = {
    title?: string;
    url?: string;
    type?: string;
    description?: string;
    author?: string;
};

/* USERS */

export type BackendUserDto = {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt?: string;
};

export type BackendCreateUserDto = {
    name: string;
    email: string;
};

export type BackendPatchUserDto = {
    name?: string;
    email?: string;
};

/* COMMENTS */

export type BackendCommentDto = {
    id: number;
    resourceId: number;
    userId: number;
    text: string;
    createdAt: string;
    updatedAt?: string;
};

export type BackendCreateCommentDto = {
    resourceId: number;
    userId: number;
    text: string;
};

export type BackendPatchCommentDto = {
    resourceId?: number;
    userId?: number;
    text?: string;
};

/* RATINGS */

export type BackendRatingDto = {
    id: number;
    resourceId: number;
    userId: number;
    value: number;
    createdAt: string;
    updatedAt?: string;
};

export type BackendCreateRatingDto = {
    resourceId: number;
    userId: number;
    value: number;
};

export type BackendPatchRatingDto = {
    resourceId?: number;
    userId?: number;
    value?: number;
};