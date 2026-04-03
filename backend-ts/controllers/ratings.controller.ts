import { NextFunction, Request, Response } from "express";
import {
    CreateRatingDto,
    PatchRatingDto,
    RatingResponseDto
} from "../dtos/ratings.dto";
import { ratingsService } from "../services/ratings.service";
import { ApiItemResponse, ApiListResponse } from "../types/api";
import { RatingListQuery } from "../types/rating";

export function getRatings(
    req: Request<{}, ApiListResponse<RatingResponseDto>, never, RatingListQuery>,
    res: Response<ApiListResponse<RatingResponseDto>>,
    next: NextFunction
): void {
    try {
        const result = ratingsService.getAll(req.query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export function getRatingById(
    req: Request<{ id: string }, ApiItemResponse<RatingResponseDto>>,
    res: Response<ApiItemResponse<RatingResponseDto>>,
    next: NextFunction
): void {
    try {
        const result = ratingsService.getById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export function createRating(
    req: Request<{}, ApiItemResponse<RatingResponseDto>, CreateRatingDto>,
    res: Response<ApiItemResponse<RatingResponseDto>>,
    next: NextFunction
): void {
    try {
        const result = ratingsService.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

export function patchRating(
    req: Request<{ id: string }, ApiItemResponse<RatingResponseDto>, PatchRatingDto>,
    res: Response<ApiItemResponse<RatingResponseDto>>,
    next: NextFunction
): void {
    try {
        const result = ratingsService.patch(req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export function deleteRating(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): void {
    try {
        ratingsService.softDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}