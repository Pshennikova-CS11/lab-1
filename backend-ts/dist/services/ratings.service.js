"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingsService = exports.RatingsService = void 0;
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
function normalizeId(value) {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new http_error_1.HttpError(400, "Invalid rating id");
    }
    return parsed;
}
class RatingsService {
    async getAll(query) {
        const page = normalizePage(query.page);
        const pageSize = normalizePageSize(query.pageSize);
        const pagination = {
            page: query.page ? Number(query.page) : undefined,
            pageSize: query.pageSize ? Number(query.pageSize) : undefined
        };
        let items = await ratings_repository_1.ratingsRepository.findAll(pagination);
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
            items: pagedItems.map(ratings_dto_1.toRatingResponseDto),
            total,
            page,
            pageSize
        };
    }
    async getById(id) {
        const ratingId = normalizeId(id);
        const rating = await ratings_repository_1.ratingsRepository.findById(ratingId);
        if (!rating || rating.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "Rating not found");
        }
        return { item: (0, ratings_dto_1.toRatingResponseDto)(rating) };
    }
    async create(dto) {
        const resource = await resources_repository_1.resourcesRepository.findById(dto.resourceId);
        if (!resource) {
            throw new http_error_1.HttpError(404, "Resource not found");
        }
        const user = await users_repository_1.usersRepository.findById(dto.userId);
        if (!user) {
            throw new http_error_1.HttpError(404, "User not found");
        }
        const duplicate = await ratings_repository_1.ratingsRepository.findByUserAndResource(dto.userId, dto.resourceId);
        if (duplicate && duplicate.deletedAt === null) {
            throw new http_error_1.HttpError(409, "Rating from this user for this resource already exists");
        }
        const now = new Date().toISOString();
        const created = await ratings_repository_1.ratingsRepository.create({
            resourceId: Number(dto.resourceId),
            userId: Number(dto.userId),
            value: dto.value,
            createdAt: now,
            updatedAt: now,
            deletedAt: null
        });
        return { item: (0, ratings_dto_1.toRatingResponseDto)(created) };
    }
    async patch(id, dto) {
        const ratingId = normalizeId(id);
        const existing = await ratings_repository_1.ratingsRepository.findById(ratingId);
        if (!existing || existing.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "Rating not found");
        }
        const nextResourceId = dto.resourceId ?? existing.resourceId;
        const nextUserId = dto.userId ?? existing.userId;
        const resource = await resources_repository_1.resourcesRepository.findById(nextResourceId);
        if (!resource) {
            throw new http_error_1.HttpError(404, "Resource not found");
        }
        const user = await users_repository_1.usersRepository.findById(nextUserId);
        if (!user) {
            throw new http_error_1.HttpError(404, "User not found");
        }
        const duplicate = await ratings_repository_1.ratingsRepository.findByUserAndResource(nextUserId, nextResourceId);
        if (duplicate && duplicate.id !== ratingId && duplicate.deletedAt === null) {
            throw new http_error_1.HttpError(409, "Rating from this user for this resource already exists");
        }
        const updated = await ratings_repository_1.ratingsRepository.update(ratingId, {
            ...dto,
            updatedAt: new Date().toISOString()
        });
        if (!updated) {
            throw new http_error_1.HttpError(404, "Rating not found");
        }
        return { item: (0, ratings_dto_1.toRatingResponseDto)(updated) };
    }
    async softDelete(id) {
        const ratingId = normalizeId(id);
        const existing = await ratings_repository_1.ratingsRepository.findById(ratingId);
        if (!existing || existing.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "Rating not found");
        }
        const updated = await ratings_repository_1.ratingsRepository.update(ratingId, {
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
