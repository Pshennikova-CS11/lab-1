import { NextFunction, Request, Response } from "express";
import { CreateRatingDto, PatchRatingDto, RatingResponseDto } from "../dtos/ratings.dto";
import { ratingsService } from "../services/ratings.service";
import { ApiItemResponse, ApiListResponse } from "../types/api";
import { RatingListQuery } from "../types/rating";

export async function getRatings(
    req: Request<{}, ApiListResponse<RatingResponseDto>, never, RatingListQuery>,
    res: Response<ApiListResponse<RatingResponseDto>>,
    next: NextFunction
): Promise<void> {
    try {
        const result = await ratingsService.getAll(req.query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function getRatingById(
    req: Request<{ id: string }, ApiItemResponse<RatingResponseDto>>,
    res: Response<ApiItemResponse<RatingResponseDto>>,
    next: NextFunction
): Promise<void> {
    try {
        const result = await ratingsService.getById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function createRating(
    req: Request<{}, ApiItemResponse<RatingResponseDto>, CreateRatingDto>,
    res: Response<ApiItemResponse<RatingResponseDto>>,
    next: NextFunction
): Promise<void> {
    try {
        const result = await ratingsService.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

export async function patchRating(
    req: Request<{ id: string }, ApiItemResponse<RatingResponseDto>, PatchRatingDto>,
    res: Response<ApiItemResponse<RatingResponseDto>>,
    next: NextFunction
): Promise<void> {
    try {
        const result = await ratingsService.patch(req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function deleteRating(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await ratingsService.softDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}