"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsService = exports.CommentsService = void 0;
const comments_dto_1 = require("../dtos/comments.dto");
const comments_repository_1 = require("../repositories/comments.repository");
const resources_repository_1 = require("../repositories/resources.repository");
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
        throw new http_error_1.HttpError(400, "Invalid comment id");
    }
    return parsed;
}
class CommentsService {
    async getAll(query) {
        const page = normalizePage(query.page);
        const pageSize = normalizePageSize(query.pageSize);
        const pagination = {
            page: query.page ? Number(query.page) : undefined,
            pageSize: query.pageSize ? Number(query.pageSize) : undefined
        };
        let items = await comments_repository_1.commentsRepository.findAll(pagination);
        items = items.filter((item) => item.deletedAt === null);
        if (query.resourceId) {
            items = items.filter((item) => item.resourceId === Number(query.resourceId));
        }
        if (query.userId) {
            items = items.filter((item) => item.userId === Number(query.userId));
        }
        if (query.search) {
            const search = query.search.toLowerCase();
            items = items.filter((item) => item.text.toLowerCase().includes(search));
        }
        const total = items.length;
        const start = (page - 1) * pageSize;
        const pagedItems = items.slice(start, start + pageSize);
        return {
            items: pagedItems.map(comments_dto_1.toCommentResponseDto),
            total,
            page,
            pageSize
        };
    }
    async getById(id, currentUserId) {
        const commentId = normalizeId(id);
        const comment = await comments_repository_1.commentsRepository.findByIdForUser(commentId, currentUserId);
        if (!comment || comment.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "Comment not found");
        }
        return { item: (0, comments_dto_1.toCommentResponseDto)(comment) };
    }
    async create(dto, currentUserId) {
        const resource = await resources_repository_1.resourcesRepository.findById(dto.resourceId);
        if (!resource) {
            throw new http_error_1.HttpError(404, "Resource not found");
        }
        const now = new Date().toISOString();
        const created = await comments_repository_1.commentsRepository.create({
            resourceId: Number(dto.resourceId),
            userId: currentUserId,
            text: dto.text,
            createdAt: now,
            updatedAt: now,
            deletedAt: null
        });
        return { item: (0, comments_dto_1.toCommentResponseDto)(created) };
    }
    async patch(id, dto, currentUserId) {
        const commentId = normalizeId(id);
        if (dto.resourceId !== undefined) {
            const resource = await resources_repository_1.resourcesRepository.findById(dto.resourceId);
            if (!resource) {
                throw new http_error_1.HttpError(404, "Resource not found");
            }
        }
        const updated = await comments_repository_1.commentsRepository.updateForUser(commentId, currentUserId, {
            resourceId: dto.resourceId !== undefined ? Number(dto.resourceId) : undefined,
            text: dto.text,
            updatedAt: new Date().toISOString()
        });
        if (!updated) {
            throw new http_error_1.HttpError(404, "Comment not found");
        }
        return { item: (0, comments_dto_1.toCommentResponseDto)(updated) };
    }
    async softDelete(id, currentUserId) {
        const commentId = normalizeId(id);
        const now = new Date().toISOString();
        const result = await comments_repository_1.commentsRepository.softDeleteForUser(commentId, currentUserId, now);
        if (result.changes === 0) {
            throw new http_error_1.HttpError(404, "Comment not found");
        }
    }
}
exports.CommentsService = CommentsService;
exports.commentsService = new CommentsService();
