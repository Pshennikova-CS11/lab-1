/// <reference path="../../shared/dto.types.ts" />

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

export type BackendResourceDto = SharedResourceDto;
export type BackendCreateResourceDto = SharedCreateResourceDto;

export type BackendUserDto = SharedUserDto;
export type BackendCreateUserDto = SharedCreateUserDto;

export type BackendCommentDto = SharedCommentDto;
export type BackendCreateCommentDto = SharedCreateCommentDto;

export type BackendRatingDto = SharedRatingDto;
export type BackendCreateRatingDto = SharedCreateRatingDto;