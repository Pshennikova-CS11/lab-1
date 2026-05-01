"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsService = exports.CommentsService = void 0;
const uuid_1 = require("uuid");
const comments_dto_1 = require("../dtos/comments.dto");
const comments_repository_1 = require("../repositories/comments.repository");
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
class CommentsService {
    getAll(query) {
        const page = normalizePage(query.page);
        const pageSize = normalizePageSize(query.pageSize);
        const includeDeleted = query.includeDeleted === "true";
        let items = comments_repository_1.commentsRepository.findAll();
        if (!includeDeleted) {
            items = items.filter((item) => item.deletedAt === null);
        }
        if (query.resourceId) {
            items = items.filter((item) => item.resourceId === query.resourceId);
        }
        if (query.userId) {
            items = items.filter((item) => item.userId === query.userId);
        }
        if (query.search) {
            const search = query.search.toLowerCase();
            items = items.filter((item) => item.text.toLowerCase().includes(search));
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
            items: pagedItems.map(comments_dto_1.toCommentResponseDto),
            total,
            page,
            pageSize
        };
    }
    getById(id) {
        const comment = comments_repository_1.commentsRepository.findById(id);
        if (!comment || comment.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "Comment not found");
        }
        return {
            item: (0, comments_dto_1.toCommentResponseDto)(comment)
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
        const now = new Date().toISOString();
        const newComment = {
            id: (0, uuid_1.v4)(),
            resourceId: dto.resourceId,
            userId: dto.userId,
            text: dto.text,
            createdAt: now,
            updatedAt: now,
            deletedAt: null
        };
        const created = comments_repository_1.commentsRepository.create(newComment);
        return {
            item: (0, comments_dto_1.toCommentResponseDto)(created)
        };
    }
    patch(id, dto) {
        const existing = comments_repository_1.commentsRepository.findById(id);
        if (!existing || existing.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "Comment not found");
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
        const updated = comments_repository_1.commentsRepository.update(id, {
            ...dto,
            updatedAt: new Date().toISOString()
        });
        if (!updated) {
            throw new http_error_1.HttpError(404, "Comment not found");
        }
        return {
            item: (0, comments_dto_1.toCommentResponseDto)(updated)
        };
    }
    softDelete(id) {
        const existing = comments_repository_1.commentsRepository.findById(id);
        if (!existing || existing.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "Comment not found");
        }
        const updated = comments_repository_1.commentsRepository.update(id, {
            deletedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        if (!updated) {
            throw new http_error_1.HttpError(404, "Comment not found");
        }
    }
}
exports.CommentsService = CommentsService;
exports.commentsService = new CommentsService();
