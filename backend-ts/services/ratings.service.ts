import {
    CreateRatingDto,
    PatchRatingDto,
    RatingResponseDto,
    toRatingResponseDto
} from "../dtos/ratings.dto";
import { ratingsRepository } from "../repositories/ratings.repository";
import { resourcesRepository } from "../repositories/resources.repository";
import { usersRepository } from "../repositories/users.repository";
import { ApiItemResponse, ApiListResponse } from "../types/api";
import { RatingListQuery } from "../types/rating";
import { HttpError } from "../utils/http-error";

function normalizePage(value?: string): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function normalizePageSize(value?: string): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 10;
}

function normalizeId(value: string): number {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new HttpError(400, "Invalid rating id");
    }

    return parsed;
}

export class RatingsService {
    async getAll(query: RatingListQuery): Promise<ApiListResponse<RatingResponseDto>> {
        const page = normalizePage(query.page);
        const pageSize = normalizePageSize(query.pageSize);

        const pagination = {
            page: query.page ? Number(query.page) : undefined,
            pageSize: query.pageSize ? Number(query.pageSize) : undefined
        };

        let items = await ratingsRepository.findAll(pagination);

        items = items.filter((item) => item.deletedAt === null);

        if (query.resourceId) {
            items = items.filter((item) => item.resourceId === Number(query.resourceId));
        }

        if (query.userId) {
            items = items.filter((item) => item.userId === Number(query.userId));
        }

        if (query.value) {
            items = items.filter((item) => item.value === Number(query.value));
        }

        const total = items.length;
        const start = (page - 1) * pageSize;
        const pagedItems = items.slice(start, start + pageSize);

        return {
            items: pagedItems.map(toRatingResponseDto),
            total,
            page,
            pageSize
        };
    }

    async getById(id: string): Promise<ApiItemResponse<RatingResponseDto>> {
        const ratingId = normalizeId(id);
        const rating = await ratingsRepository.findById(ratingId);

        if (!rating || rating.deletedAt !== null) {
            throw new HttpError(404, "Rating not found");
        }

        return { item: toRatingResponseDto(rating) };
    }

    async create(dto: CreateRatingDto): Promise<ApiItemResponse<RatingResponseDto>> {
        const resource = await resourcesRepository.findById(dto.resourceId);
        if (!resource) {
            throw new HttpError(404, "Resource not found");
        }

        const user = await usersRepository.findById(dto.userId);
        if (!user) {
            throw new HttpError(404, "User not found");
        }

        const duplicate = await ratingsRepository.findByUserAndResource(dto.userId, dto.resourceId);
        if (duplicate && duplicate.deletedAt === null) {
            throw new HttpError(409, "Rating from this user for this resource already exists");
        }

        const now = new Date().toISOString();

        const created = await ratingsRepository.create({
            resourceId: Number(dto.resourceId),
            userId: Number(dto.userId),
            value: dto.value,
            createdAt: now,
            updatedAt: now,
            deletedAt: null
        });

        return { item: toRatingResponseDto(created) };
    }

    async patch(id: string, dto: PatchRatingDto): Promise<ApiItemResponse<RatingResponseDto>> {
        const ratingId = normalizeId(id);
        const existing = await ratingsRepository.findById(ratingId);

        if (!existing || existing.deletedAt !== null) {
            throw new HttpError(404, "Rating not found");
        }

        const nextResourceId = dto.resourceId ?? existing.resourceId;
        const nextUserId = dto.userId ?? existing.userId;

        const resource = await resourcesRepository.findById(nextResourceId);
        if (!resource) {
            throw new HttpError(404, "Resource not found");
        }

        const user = await usersRepository.findById(nextUserId);
        if (!user) {
            throw new HttpError(404, "User not found");
        }

        const duplicate = await ratingsRepository.findByUserAndResource(nextUserId, nextResourceId);
        if (duplicate && duplicate.id !== ratingId && duplicate.deletedAt === null) {
            throw new HttpError(409, "Rating from this user for this resource already exists");
        }

        const updated = await ratingsRepository.update(ratingId, {
            ...dto,
            updatedAt: new Date().toISOString()
        });

        if (!updated) {
            throw new HttpError(404, "Rating not found");
        }

        return { item: toRatingResponseDto(updated) };
    }

    async softDelete(id: string): Promise<void> {
        const ratingId = normalizeId(id);

        const existing = await ratingsRepository.findById(ratingId);
        if (!existing || existing.deletedAt !== null) {
            throw new HttpError(404, "Rating not found");
        }

        const updated = await ratingsRepository.update(ratingId, {
            deletedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        if (!updated) {
            throw new HttpError(404, "Rating not found");
        }
    }
}

export const ratingsService = new RatingsService();