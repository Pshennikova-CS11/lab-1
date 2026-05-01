"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingsService = exports.RatingsService = void 0;
const uuid_1 = require("uuid");
const ratings_dto_1 = require("../dtos/ratings.dto");
const ratings_repository_1 = require("../repositories/ratings.repository");
const resources_repository_1 = require("../repositories/resources.repository");
const users_repository_1 = require("../repositories/users.repository");
const http_error_1 = require("../utils/http-error");
function normalizePage(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}
function normalizePageSize(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 10;
}
class RatingsService {
    getAll(query) {
        const page = normalizePage(query.page);
        const pageSize = normalizePageSize(query.pageSize);
        const includeDeleted = query.includeDeleted === "true";
        let items = ratings_repository_1.ratingsRepository.findAll();
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
                const left = String(a[query.sortBy] ?? "").toLowerCase();
                const right = String(b[query.sortBy] ?? "").toLowerCase();
                if (left < right)
                    return -1 * sortDir;
                if (left > right)
                    return 1 * sortDir;
                return 0;
            });
        }
        const total = items.length;
        const start = (page - 1) * pageSize;
        const pagedItems = items.slice(start, start + pageSize);
        return {
            items: pagedItems.map(ratings_dto_1.toRatingResponseDto),
            total,
            page,
            pageSize
        };
    }
    getById(id) {
        const rating = ratings_repository_1.ratingsRepository.findById(id);
        if (!rating || rating.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "Rating not found");
        }
        return {
            item: (0, ratings_dto_1.toRatingResponseDto)(rating)
        };
    }
    create(dto) {
        const resource = resources_repository_1.resourcesRepository.findById(dto.resourceId);
        if (!resource || resource.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "Resource not found");
        }
        const user = users_repository_1.usersRepository.findById(dto.userId);
        if (!user || user.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "User not found");
        }
        const duplicate = ratings_repository_1.ratingsRepository.findByUserAndResource(dto.userId, dto.resourceId);
        if (duplicate && duplicate.deletedAt === null) {
            throw new http_error_1.HttpError(409, "Rating from this user for this resource already exists");
        }
        const now = new Date().toISOString();
        const newRating = {
            id: (0, uuid_1.v4)(),
            resourceId: dto.resourceId,
            userId: dto.userId,
            value: dto.value,
            createdAt: now,
            updatedAt: now,
            deletedAt: null
        };
        const created = ratings_repository_1.ratingsRepository.create(newRating);
        return {
            item: (0, ratings_dto_1.toRatingResponseDto)(created)
        };
    }
    patch(id, dto) {
        const existing = ratings_repository_1.ratingsRepository.findById(id);
        if (!existing || existing.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "Rating not found");
        }
        const nextResourceId = dto.resourceId ?? existing.resourceId;
        const nextUserId = dto.userId ?? existing.userId;
        const resource = resources_repository_1.resourcesRepository.findById(nextResourceId);
        if (!resource || resource.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "Resource not found");
        }
        const user = users_repository_1.usersRepository.findById(nextUserId);
        if (!user || user.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "User not found");
        }
        const duplicate = ratings_repository_1.ratingsRepository.findByUserAndResource(nextUserId, nextResourceId);
        if (duplicate && duplicate.id !== id && duplicate.deletedAt === null) {
            throw new http_error_1.HttpError(409, "Rating from this user for this resource already exists");
        }
        const updated = ratings_repository_1.ratingsRepository.update(id, {
            ...dto,
            updatedAt: new Date().toISOString()
        });
        if (!updated) {
            throw new http_error_1.HttpError(404, "Rating not found");
        }
        return {
            item: (0, ratings_dto_1.toRatingResponseDto)(updated)
        };
    }
    softDelete(id) {
        const existing = ratings_repository_1.ratingsRepository.findById(id);
        if (!existing || existing.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "Rating not found");
        }
        const updated = ratings_repository_1.ratingsRepository.update(id, {
            deletedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        if (!updated) {
            throw new http_error_1.HttpError(404, "Rating not found");
        }
    }
}
exports.RatingsService = RatingsService;
exports.ratingsService = new RatingsService();
