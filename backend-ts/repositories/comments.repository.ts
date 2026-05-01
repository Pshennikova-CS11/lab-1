import { CommentEntity } from "../types/comment";
import { all, get, run } from "../db/dbClient";

type CreateCommentInput = Omit<CommentEntity, "id">;

class CommentsRepository {
    async findAll(query: { page?: number; pageSize?: number } = {}): Promise<CommentEntity[]> {
        const limit = Number(query.pageSize) || 100;
        const offset = ((Number(query.page) || 1) - 1) * limit;

        return await all<CommentEntity>(`
            SELECT id, resourceId, userId, text, createdAt, updatedAt, deletedAt
            FROM Comments
            ORDER BY createdAt DESC
            LIMIT ${limit} OFFSET ${offset}
        `);
    }

    async findById(id: number): Promise<CommentEntity | undefined> {
        return await get<CommentEntity>(`
            SELECT id, resourceId, userId, text, createdAt, updatedAt, deletedAt
            FROM Comments
            WHERE id = ${id}
        `);
    }

    async create(comment: CreateCommentInput): Promise<CommentEntity> {
        const escapedText = comment.text.replace(/'/g, "''");

        const result = await run(`
            INSERT INTO Comments (resourceId, userId, text, createdAt, updatedAt, deletedAt)
            VALUES (
                ${comment.resourceId},
                ${comment.userId},
                '${escapedText}',
                '${comment.createdAt}',
                '${comment.updatedAt}',
                NULL
            )
        `);

        return (await this.findById(result.lastID))!;
    }

    async update(id: number, changes: Partial<CommentEntity>): Promise<CommentEntity | null> {
        const existing = await this.findById(id);

        if (!existing) {
            return null;
        }

        const resourceId = changes.resourceId ?? existing.resourceId;
        const userId = changes.userId ?? existing.userId;
        const text = (changes.text ?? existing.text).replace(/'/g, "''");
        const updatedAt = changes.updatedAt ?? existing.updatedAt;
        const deletedAt = changes.deletedAt ?? existing.deletedAt;

        await run(`
            UPDATE Comments
            SET resourceId = ${resourceId},
                userId = ${userId},
                text = '${text}',
                updatedAt = '${updatedAt}',
                deletedAt = ${deletedAt ? `'${deletedAt}'` : "NULL"}
            WHERE id = ${id}
        `);

        return await this.findById(id) || null;
    }
}

export const commentsRepository = new CommentsRepository();