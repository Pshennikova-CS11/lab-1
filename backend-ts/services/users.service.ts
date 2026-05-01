import { usersRepository } from "../repositories/users.repository";
import { HttpError } from "../utils/http-error";

type UserQuery = {
    search?: string;
    page?: string;
    pageSize?: string;
    includeDeleted?: string;
};

type UserInput = {
    name: string;
    email: string;
};

function normalizeId(id: string): number {
    const parsed = Number(id);

    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new HttpError(400, "Invalid user id");
    }

    return parsed;
}

function normalizePage(value?: string): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function normalizePageSize(value?: string): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 10;
}

export const usersService = {
    getAll: async (query: UserQuery) => {
        const page = normalizePage(query.page);
        const pageSize = normalizePageSize(query.pageSize);
        const includeDeleted = query.includeDeleted === "true";

        let items = await usersRepository.findAll();

        if (!includeDeleted) {
            items = items.filter((item) => item.deletedAt === null);
        }

        if (query.search) {
            const search = query.search.toLowerCase();
            items = items.filter((item) =>
                item.name.toLowerCase().includes(search) ||
                item.email.toLowerCase().includes(search)
            );
        }

        const total = items.length;
        const start = (page - 1) * pageSize;
        const pagedItems = items.slice(start, start + pageSize);

        return {
            items: pagedItems,
            total,
            page,
            pageSize
        };
    },

    getById: async (id: string) => {
        const userId = normalizeId(id);
        const user = await usersRepository.findById(userId);

        if (!user || user.deletedAt !== null) {
            throw new HttpError(404, "User not found");
        }

        return {
            item: user
        };
    },

        create: async (data: UserInput) => {
            try {
                const normalizedEmail = data.email.trim().toLowerCase();

                const existing = await usersRepository.findByEmail(normalizedEmail);

                if (existing && existing.deletedAt === null) {
                    throw new HttpError(409, "User with this email already exists");
                }

                if (existing && existing.deletedAt !== null) {
                    const restored = await usersRepository.update(existing.id, {
                        name: data.name.trim(),
                        email: normalizedEmail,
                        deletedAt: null,
                        updatedAt: new Date().toISOString()
                    });

                    return { item: restored };
                }

                const now = new Date().toISOString();

                const created = await usersRepository.create({
                    name: data.name.trim(),
                    email: normalizedEmail,
                    createdAt: now,
                    updatedAt: now,
                    deletedAt: null
                });

                return { item: created };
            } catch (error) {
                const message = String((error as Error).message || "");

                if (message.includes("UNIQUE constraint failed")) {
                    throw new HttpError(409, "User with this email already exists");
                }

                throw error;
            }
        },

    patch: async (id: string, data: Partial<UserInput>) => {
        const userId = normalizeId(id);
        const existing = await usersRepository.findById(userId);

        if (!existing || existing.deletedAt !== null) {
            throw new HttpError(404, "User not found");
        }

        const nextEmail = data.email ?? existing.email;

        const duplicate = await usersRepository.findByEmail(nextEmail);
        if (duplicate && duplicate.id !== userId && duplicate.deletedAt === null) {
            throw new HttpError(409, "User with this email already exists");
        }

        const updated = await usersRepository.update(userId, {
            ...data,
            updatedAt: new Date().toISOString()
        });

        if (!updated) {
            throw new HttpError(404, "User not found");
        }

        return {
            item: updated
        };
    },

    softDelete: async (id: string) => {
        const userId = normalizeId(id);
        const existing = await usersRepository.findById(userId);

        if (!existing || existing.deletedAt !== null) {
            throw new HttpError(404, "User not found");
        }

        const updated = await usersRepository.update(userId, {
            deletedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        if (!updated) {
            throw new HttpError(404, "User not found");
        }
    }
};