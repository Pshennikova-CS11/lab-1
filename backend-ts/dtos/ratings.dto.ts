import { RatingEntity } from "../types/rating";

export interface CreateRatingDto {
    resourceId: string;
    userId: string;
    value: number;
}

export interface PatchRatingDto {
    resourceId?: string;
    userId?: string;
    value?: number;
}

export interface RatingResponseDto {
    id: string;
    resourceId: string;
    userId: string;
    value: number;
    createdAt: string;
    updatedAt: string;
}

export function toRatingResponseDto(rating: RatingEntity): RatingResponseDto {
    return {
        id: rating.id,
        resourceId: rating.resourceId,
        userId: rating.userId,
        value: rating.value,
        createdAt: rating.createdAt,
        updatedAt: rating.updatedAt
    };
}