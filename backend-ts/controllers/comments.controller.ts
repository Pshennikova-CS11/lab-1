import { NextFunction, Request, Response } from "express";
import {
    CommentResponseDto,
    CreateCommentDto,
    PatchCommentDto
} from "../dtos/comments.dto";
import { commentsService } from "../services/comments.service";
import { ApiItemResponse, ApiListResponse } from "../types/api";
import { CommentListQuery } from "../types/comment";

export function getComments(
    req: Request<{}, ApiListResponse<CommentResponseDto>, never, CommentListQuery>,
    res: Response<ApiListResponse<CommentResponseDto>>,
    next: NextFunction
): void {
    try {
        const result = commentsService.getAll(req.query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export function getCommentById(
    req: Request<{ id: string }, ApiItemResponse<CommentResponseDto>>,
    res: Response<ApiItemResponse<CommentResponseDto>>,
    next: NextFunction
): void {
    try {
        const result = commentsService.getById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export function createComment(
    req: Request<{}, ApiItemResponse<CommentResponseDto>, CreateCommentDto>,
    res: Response<ApiItemResponse<CommentResponseDto>>,
    next: NextFunction
): void {
    try {
        const result = commentsService.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

export function patchComment(
    req: Request<{ id: string }, ApiItemResponse<CommentResponseDto>, PatchCommentDto>,
    res: Response<ApiItemResponse<CommentResponseDto>>,
    next: NextFunction
): void {
    try {
        const result = commentsService.patch(req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export function deleteComment(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): void {
    try {
        commentsService.softDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}