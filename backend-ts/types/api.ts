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
    status: "error";
    message: string;
    details?: unknown;
}