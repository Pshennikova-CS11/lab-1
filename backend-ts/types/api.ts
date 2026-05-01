export interface ApiItemResponse<T> {
    item: T;
}

export interface ApiListResponse<T> {
    items: T[]; //дані
    total: number; //кількість записів у бд
    page: number; //номер сторінки
    pageSize: number; //кількість елементів на сторінці
}

export interface ApiErrorResponse {
    status: "error";
    message: string;
    details?: unknown;
}