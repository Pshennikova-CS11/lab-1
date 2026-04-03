import { v4 as uuidv4 } from "uuid";
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
import { RatingEntity, RatingListQuery } from "../types/rating";
import { HttpError } from "../utils/http-error";

function normalizePage(value?: string): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function normalizePageSize(value?: string): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 10;
}

export class RatingsService {
    getAll(query: RatingListQuery): ApiListResponse<RatingResponseDto> {
        const page = normalizePage(query.page);
        const pageSize = normalizePageSize(query.pageSize);
        const includeDeleted = query.includeDeleted === "true";

        let items = ratingsRepository.findAll();

        if (!includeDeleted) {
            items = items.filter((item) => item.deletedAt === null);
        }

        if (query.resourceId) {
            items = items.filter((item) => item.resourceId === query.resourceId);
        }

        if (query.userId) {
            items = items.filter((item) => item.userId === query.userId);
        }

        if (query.value) {
            const value = Number(query.value);
            if (Number.isInteger(value)) {
                items = items.filter((item) => item.value === value);
            }
        }

        if (query.sortBy) {
            const sortDir = query.sortDir === "desc" ? -1 : 1;

            items.sort((a, b) => {
                const left = String(a[query.sortBy as keyof RatingEntity] ?? "").toLowerCase();
                const right = String(b[query.sortBy as keyof RatingEntity] ?? "").toLowerCase();

                if (left < right) return -1 * sortDir;
                if (left > right) return 1 * sortDir;
                return 0;
            });
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

    getById(id: string): ApiItemResponse<RatingResponseDto> {
        const rating = ratingsRepository.findById(id);

        if (!rating || rating.deletedAt !== null) {
            throw new HttpError(404, "Rating not found");
        }

        return {
            item: toRatingResponseDto(rating)
        };
    }

    create(dto: CreateRatingDto): ApiItemResponse<RatingResponseDto> {
        const resource = resourcesRepository.findById(dto.resourceId);
        if (!resource || resource.deletedAt !== null) {
            throw new HttpError(404, "Resource not found");
        }

        const user = usersRepository.findById(dto.userId);
        if (!user || user.deletedAt !== null) {
            throw new HttpError(404, "User not found");
        }

        const duplicate = ratingsRepository.findByUserAndResource(dto.userId, dto.resourceId);
        if (duplicate && duplicate.deletedAt === null) {
            throw new HttpError(409, "Rating from this user for this resource already exists");
        }

        const now = new Date().toISOString();

        const newRating: RatingEntity = {
            id: uuidv4(),
            resourceId: dto.resourceId,
            userId: dto.userId,
            value: dto.value,
            createdAt: now,
            updatedAt: now,
            deletedAt: null
        };

        const created = ratingsRepository.create(newRating);

        return {
            item: toRatingResponseDto(created)
        };
    }

    patch(id: string, dto: PatchRatingDto): ApiItemResponse<RatingResponseDto> {
        const existing = ratingsRepository.findById(id);

        if (!existing || existing.deletedAt !== null) {
            throw new HttpError(404, "Rating not found");
        }

        const nextResourceId = dto.resourceId ?? existing.resourceId;
        const nextUserId = dto.userId ?? existing.userId;

        const resource = resourcesRepository.findById(nextResourceId);
        if (!resource || resource.deletedAt !== null) {
            throw new HttpError(404, "Resource not found");
        }

        const user = usersRepository.findById(nextUserId);
        if (!user || user.deletedAt !== null) {
            throw new HttpError(404, "User not found");
        }

        const duplicate = ratingsRepository.findByUserAndResource(nextUserId, nextResourceId);
        if (duplicate && duplicate.id !== id && duplicate.deletedAt === null) {
            throw new HttpError(409, "Rating from this user for this resource already exists");
        }

        const updated = ratingsRepository.update(id, {
            ...dto,
            updatedAt: new Date().toISOString()
        });

        if (!updated) {
            throw new HttpError(404, "Rating not found");
        }

        return {
            item: toRatingResponseDto(updated)
        };
    }

    softDelete(id: string): void {
        const existing = ratingsRepository.findById(id);

        if (!existing || existing.deletedAt !== null) {
            throw new HttpError(404, "Rating not found");
        }

        const updated = ratingsRepository.update(id, {
            deletedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        if (!updated) {
            throw new HttpError(404, "Rating not found");
        }
    }
}

export const ratingsService = new RatingsService();