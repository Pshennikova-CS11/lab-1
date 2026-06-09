import {
    CommentResponseDto,
    CreateCommentDto,
    PatchCommentDto,
    toCommentResponseDto
} from "../dtos/comments.dto";
import { commentsRepository } from "../repositories/comments.repository";
import { resourcesRepository } from "../repositories/resources.repository";
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

function normalizeId(value: string): number {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new HttpError(400, "Invalid comment id");
    }

    return parsed;
}

export class CommentsService {
    async getAll(query: CommentListQuery): Promise<ApiListResponse<CommentResponseDto>> {
        const page = normalizePage(query.page);
        const pageSize = normalizePageSize(query.pageSize);

        const pagination = {
            page: query.page ? Number(query.page) : undefined,
            pageSize: query.pageSize ? Number(query.pageSize) : undefined
        };

        let items = await commentsRepository.findAll(pagination);

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
            items: pagedItems.map(toCommentResponseDto),
            total,
            page,
            pageSize
        };
    }

    async getById(id: string, currentUserId: number): Promise<ApiItemResponse<CommentResponseDto>> {
        const commentId = normalizeId(id);

        const comment = await commentsRepository.findByIdForUser(commentId, currentUserId);

        if (!comment || comment.deletedAt !== null) {
            throw new HttpError(404, "Comment not found");
        }

        return { item: toCommentResponseDto(comment) };
    }

    async create(
        dto: CreateCommentDto,
        currentUserId: number
    ): Promise<ApiItemResponse<CommentResponseDto>> {
        const resource = await resourcesRepository.findById(dto.resourceId);

        if (!resource) {
            throw new HttpError(404, "Resource not found");
        }

        const now = new Date().toISOString();

        const created = await commentsRepository.create({
            resourceId: Number(dto.resourceId),
            userId: currentUserId,
            text: dto.text,
            createdAt: now,
            updatedAt: now,
            deletedAt: null
        });

        return { item: toCommentResponseDto(created) };
    }

    async patch(
        id: string,
        dto: PatchCommentDto,
        currentUserId: number
    ): Promise<ApiItemResponse<CommentResponseDto>> {
        const commentId = normalizeId(id);

        if (dto.resourceId !== undefined) {
            const resource = await resourcesRepository.findById(dto.resourceId);

            if (!resource) {
                throw new HttpError(404, "Resource not found");
            }
        }

        const updated = await commentsRepository.updateForUser(commentId, currentUserId, {
            resourceId: dto.resourceId !== undefined ? Number(dto.resourceId) : undefined,
            text: dto.text,
            updatedAt: new Date().toISOString()
        });

        if (!updated) {
            throw new HttpError(404, "Comment not found");
        }

        return { item: toCommentResponseDto(updated) };
    }

    async softDelete(id: string, currentUserId: number): Promise<void> {
        const commentId = normalizeId(id);
        const now = new Date().toISOString();

        const result = await commentsRepository.softDeleteForUser(
            commentId,
            currentUserId,
            now
        );

        if (result.changes === 0) {
            throw new HttpError(404, "Comment not found");
        }
    }
}

export const commentsService = new CommentsService();