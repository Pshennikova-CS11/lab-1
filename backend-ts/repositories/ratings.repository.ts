import { RatingEntity } from "../types/rating";
import { all, get, run } from "../db/dbClient";

type CreateRatingInput = Omit<RatingEntity, "id">;

class RatingsRepository {
    async findAll(query: { page?: number; pageSize?: number } = {}): Promise<RatingEntity[]> {
        const limit = Number(query.pageSize) || 100;
        const offset = ((Number(query.page) || 1) - 1) * limit;

        return await all<RatingEntity>(`
            SELECT id, resourceId, userId, value, createdAt, updatedAt, deletedAt
            FROM Ratings
            ORDER BY createdAt DESC
            LIMIT ${limit} OFFSET ${offset}
        `);
    }

    async findById(id: number): Promise<RatingEntity | undefined> {
        return await get<RatingEntity>(`
            SELECT id, resourceId, userId, value, createdAt, updatedAt, deletedAt
            FROM Ratings
            WHERE id = ${id}
        `);
    }

    async findByUserAndResource(userId: number, resourceId: number): Promise<RatingEntity | undefined> {
        return await get<RatingEntity>(`
            SELECT id, resourceId, userId, value, createdAt, updatedAt, deletedAt
            FROM Ratings
            WHERE userId = ${userId} AND resourceId = ${resourceId}
        `);
    }

    async create(rating: CreateRatingInput): Promise<RatingEntity> {
        const result = await run(`
            INSERT INTO Ratings (resourceId, userId, value, createdAt, updatedAt, deletedAt)
            VALUES (
                ${rating.resourceId},
                ${rating.userId},
                ${rating.value},
                '${rating.createdAt}',
                '${rating.updatedAt}',
                NULL
            )
        `);

        return (await this.findById(result.lastID))!;
    }

    async update(id: number, changes: Partial<RatingEntity>): Promise<RatingEntity | null> {
        const existing = await this.findById(id);

        if (!existing) {
            return null;
        }

        const resourceId = changes.resourceId ?? existing.resourceId;
        const userId = changes.userId ?? existing.userId;
        const value = changes.value ?? existing.value;
        const updatedAt = changes.updatedAt ?? existing.updatedAt;
        const deletedAt = changes.deletedAt ?? existing.deletedAt;

        await run(`
            UPDATE Ratings
            SET resourceId = ${resourceId},
                userId = ${userId},
                value = ${value},
                updatedAt = '${updatedAt}',
                deletedAt = ${deletedAt ? `'${deletedAt}'` : "NULL"}
            WHERE id = ${id}
        `);

        return await this.findById(id) || null;
    }
}

export const ratingsRepository = new RatingsRepository();