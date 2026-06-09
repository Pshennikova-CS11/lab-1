import { NextFunction, Request, Response } from "express";
import { CommentResponseDto, CreateCommentDto, PatchCommentDto } from "../dtos/comments.dto";
import { commentsService } from "../services/comments.service";
import { ApiListResponse } from "../types/api";
import { CommentListQuery } from "../types/comment";

type CommentParams = {
    id: string;
};

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
    req: Request<CommentParams>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const currentUserId = req.user!.id;
        const result = await commentsService.getById(req.params.id, currentUserId);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

export async function createComment(
    req: Request<{}, unknown, CreateCommentDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const currentUserId = req.user!.id;
        const result = await commentsService.create(req.body, currentUserId);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
}

export async function patchComment(
    req: Request<CommentParams, unknown, PatchCommentDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const currentUserId = req.user!.id;

        const result = await commentsService.patch(
            req.params.id,
            req.body,
            currentUserId
        );

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

export async function deleteComment(
    req: Request<CommentParams>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const currentUserId = req.user!.id;
        await commentsService.softDelete(req.params.id, currentUserId);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}