import { CommentEntity } from "../types/comment";
import { all, get, run } from "../db/dbClient";

type CreateCommentInput = {
    resourceId: number;
    userId: number;
    text: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};

class CommentsRepository {
    async findAll(query: { page?: number; pageSize?: number } = {}): Promise<CommentEntity[]> {
        const limit = Number(query.pageSize) || 100;
        const offset = ((Number(query.page) || 1) - 1) * limit;

        return await all<CommentEntity>(
            `
                SELECT id, resourceId, userId, text, createdAt, updatedAt, deletedAt
                FROM Comments
                ORDER BY createdAt DESC
                    LIMIT ? OFFSET ?;
            `,
            [limit, offset]
        );
    }

    async findById(id: number): Promise<CommentEntity | undefined> {
        return await get<CommentEntity>(
            `
                SELECT id, resourceId, userId, text, createdAt, updatedAt, deletedAt
                FROM Comments
                WHERE id = ?;
            `,
            [id]
        );
    }

    async findByIdForUser(id: number, userId: number): Promise<CommentEntity | undefined> {
        return await get<CommentEntity>(
            `
            SELECT id, resourceId, userId, text, createdAt, updatedAt, deletedAt
            FROM Comments
            WHERE id = ? AND userId = ?;
            `,
            [id, userId]
        );
    }

    async create(comment: CreateCommentInput): Promise<CommentEntity> {
        const result = await run(
            `
            INSERT INTO Comments (resourceId, userId, text, createdAt, updatedAt, deletedAt)
            VALUES (?, ?, ?, ?, ?, ?);
            `,
            [
                comment.resourceId,
                comment.userId,
                comment.text,
                comment.createdAt,
                comment.updatedAt,
                comment.deletedAt
            ]
        );

        return (await this.findByIdForUser(result.lastID, comment.userId))!;
    }

    async updateForUser(
        id: number,
        currentUserId: number,
        changes: {
            resourceId?: number;
            text?: string;
            updatedAt: string;
        }
    ): Promise<CommentEntity | null> {
        const existing = await this.findByIdForUser(id, currentUserId);

        if (!existing || existing.deletedAt !== null) {
            return null;
        }

        const resourceId = changes.resourceId ?? existing.resourceId;
        const text = changes.text ?? existing.text;

        await run(
            `
            UPDATE Comments
            SET resourceId = ?,
                text = ?,
                updatedAt = ?
            WHERE id = ? AND userId = ?;
            `,
            [resourceId, text, changes.updatedAt, id, currentUserId]
        );

        return (await this.findByIdForUser(id, currentUserId)) || null;
    }

    async softDeleteForUser(
        id: number,
        currentUserId: number,
        deletedAt: string
    ): Promise<{ changes: number }> {
        return await run(
            `
            UPDATE Comments
            SET deletedAt = ?,
                updatedAt = ?
            WHERE id = ? AND userId = ?;
            `,
            [deletedAt, deletedAt, id, currentUserId]
        );
    }
}

export const commentsRepository = new CommentsRepository();