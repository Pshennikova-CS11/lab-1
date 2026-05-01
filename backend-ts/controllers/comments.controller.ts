import { NextFunction, Request, Response } from "express";
import { CommentResponseDto, CreateCommentDto, PatchCommentDto } from "../dtos/comments.dto";
import { commentsService } from "../services/comments.service";
import { ApiItemResponse, ApiListResponse } from "../types/api";
import { CommentListQuery } from "../types/comment";

export async function getComments(
    req: Request<{}, ApiListResponse<CommentResponseDto>, never, CommentListQuery>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await commentsService.getAll(req.query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function getCommentById(
    req: Request<{ id: string }, ApiItemResponse<CommentResponseDto>>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await commentsService.getById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function createComment(
    req: Request<{}, ApiItemResponse<CommentResponseDto>, CreateCommentDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await commentsService.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

export async function patchComment(
    req: Request<{ id: string }, ApiItemResponse<CommentResponseDto>, PatchCommentDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await commentsService.patch(req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function deleteComment(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await commentsService.softDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}