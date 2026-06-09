import { CommentEntity } from "../types/comment";

export interface CreateCommentDto {
    resourceId: number;
    userId: number;
    text: string;
}

export interface PatchCommentDto {
    resourceId?: number;
    userId?: number;
    text?: string;
}

export interface CommentResponseDto {
    id: number;
    resourceId: number;
    userId: number;
    text: string;
    createdAt: string;
    updatedAt: string;
}

export function toCommentResponseDto(comment: CommentEntity): CommentResponseDto {
    return {
        id: comment.id,
        resourceId: comment.resourceId,
        userId: comment.userId,
        text: comment.text,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt
    };
}