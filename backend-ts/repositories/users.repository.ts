import { UserEntity } from "../types/user";
import { all, get, run } from "../db/dbClient";

class UsersRepository {
    async findAll(query: { page?: number; pageSize?: number } = {}): Promise<UserEntity[]> {
        const limit = Number(query.pageSize) || 100;
        const offset = ((Number(query.page) || 1) - 1) * limit;

        return await all<UserEntity>(`
            SELECT id, name, email, createdAt, updatedAt, deletedAt
            FROM Users
            ORDER BY createdAt DESC
            LIMIT ${limit} OFFSET ${offset}
        `);
    }

    async findById(id: number): Promise<UserEntity | undefined> {
        return await get<UserEntity>(`
            SELECT id, name, email, createdAt, updatedAt, deletedAt
            FROM Users
            WHERE id = ${id}
        `);
    }

    async findByEmail(email: string): Promise<UserEntity | undefined> {
        return await get<UserEntity>(`
            SELECT id, name, email, createdAt, updatedAt, deletedAt
            FROM Users
            WHERE email = '${email.toLowerCase()}'
        `);
    }

    async create(user: Omit<UserEntity, "id">): Promise<UserEntity> {
        const now = new Date().toISOString();

        const result = await run(`
            INSERT INTO Users (name, email, createdAt, updatedAt, deletedAt)
            VALUES ('${user.name}', '${user.email}', '${now}', '${now}', NULL)
        `);

        return (await this.findById(result.lastID))!;
    }

    async update(id: number, changes: Partial<UserEntity>): Promise<UserEntity | null> {
        const existing = await this.findById(id);

        if (!existing) {
            return null;
        }

        const name = changes.name ?? existing.name;
        const email = changes.email ?? existing.email;
        const deletedAt = changes.deletedAt ?? existing.deletedAt;
        const now = new Date().toISOString();

        await run(`
            UPDATE Users
            SET name = '${name}',
                email = '${email}',
                updatedAt = '${now}',
                deletedAt = ${deletedAt ? `'${deletedAt}'` : "NULL"}
            WHERE id = ${id}
        `);

        return await this.findById(id) || null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await run(`
            DELETE FROM Users
            WHERE id = ${id}
        `);

        return result.changes > 0;
    }
}

export const usersRepository = new UsersRepository();