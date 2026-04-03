import { v4 as uuidv4 } from "uuid";
import {
    CommentResponseDto,
    CreateCommentDto,
    PatchCommentDto,
    toCommentResponseDto
} from "../dtos/comments.dto";
import { commentsRepository } from "../repositories/comments.repository";
import { resourcesRepository } from "../repositories/resources.repository";
import { usersRepository } from "../repositories/users.repository";
import { ApiItemResponse, ApiListResponse } from "../types/api";
import { CommentEntity, CommentListQuery } from "../types/comment";
import { HttpError } from "../utils/http-error";

function normalizePage(value?: string): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function normalizePageSize(value?: string): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 10;
}

export class CommentsService {
    getAll(query: CommentListQuery): ApiListResponse<CommentResponseDto> {
        const page = normalizePage(query.page);
        const pageSize = normalizePageSize(query.pageSize);
        const includeDeleted = query.includeDeleted === "true";

        let items = commentsRepository.findAll();

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
                const left = String(a[query.sortBy as keyof CommentEntity] ?? "").toLowerCase();
                const right = String(b[query.sortBy as keyof CommentEntity] ?? "").toLowerCase();

                if (left < right) return -1 * sortDir;
                if (left > right) return 1 * sortDir;
                return 0;
            });
        }

        const total = items.length;
        const start = (page - 1) * pageSize;
        const pagedItems = items.slice(start, start + pageSize);

        return {
            items: pagedItems.map(toCommentResponseDto),
            total,
            page,
            pageSize
        };
    }

    getById(id: string): ApiItemResponse<CommentResponseDto> {
        const comment = commentsRepository.findById(id);

        if (!comment || comment.deletedAt !== null) {
            throw new HttpError(404, "Comment not found");
        }

        return {
            item: toCommentResponseDto(comment)
        };
    }

    create(dto: CreateCommentDto): ApiItemResponse<CommentResponseDto> {
        const resource = resourcesRepository.findById(dto.resourceId);
        if (!resource || resource.deletedAt !== null) {
            throw new HttpError(404, "Resource not found");
        }

        const user = usersRepository.findById(dto.userId);
        if (!user || user.deletedAt !== null) {
            throw new HttpError(404, "User not found");
        }

        const now = new Date().toISOString();

        const newComment: CommentEntity = {
            id: uuidv4(),
            resourceId: dto.resourceId,
            userId: dto.userId,
            text: dto.text,
            createdAt: now,
            updatedAt: now,
            deletedAt: null
        };

        const created = commentsRepository.create(newComment);

        return {
            item: toCommentResponseDto(created)
        };
    }

    patch(id: string, dto: PatchCommentDto): ApiItemResponse<CommentResponseDto> {
        const existing = commentsRepository.findById(id);

        if (!existing || existing.deletedAt !== null) {
            throw new HttpError(404, "Comment not found");
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

        const updated = commentsRepository.update(id, {
            ...dto,
            updatedAt: new Date().toISOString()
        });

        if (!updated) {
            throw new HttpError(404, "Comment not found");
        }

        return {
            item: toCommentResponseDto(updated)
        };
    }

    softDelete(id: string): void {
        const existing = commentsRepository.findById(id);

        if (!existing || existing.deletedAt !== null) {
            throw new HttpError(404, "Comment not found");
        }

        const updated = commentsRepository.update(id, {
            deletedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        if (!updated) {
            throw new HttpError(404, "Comment not found");
        }
    }
}

export const commentsService = new CommentsService();