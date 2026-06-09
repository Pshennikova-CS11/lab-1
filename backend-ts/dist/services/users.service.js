"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const users_repository_1 = require("../repositories/users.repository");
const http_error_1 = require("../utils/http-error");
function normalizeId(id) {
    const parsed = Number(id);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new http_error_1.HttpError(400, "Invalid user id");
    }
    return parsed;
}
function normalizePage(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}
function normalizePageSize(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 10;
}
exports.usersService = {
    getAll: async (query) => {
        const page = normalizePage(query.page);
        const pageSize = normalizePageSize(query.pageSize);
        const includeDeleted = query.includeDeleted === "true";
        let items = await users_repository_1.usersRepository.findAll();
        if (!includeDeleted) {
            items = items.filter((item) => item.deletedAt === null);
        }
        if (query.search) {
            const search = query.search.toLowerCase();
            items = items.filter((item) => item.name.toLowerCase().includes(search) ||
                item.email.toLowerCase().includes(search));
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
    getById: async (id) => {
        const userId = normalizeId(id);
        const user = await users_repository_1.usersRepository.findById(userId);
        if (!user || user.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "User not found");
        }
        return {
            item: user
        };
    },
    create: async (data) => {
        try {
            const normalizedEmail = data.email.trim().toLowerCase();
            const existing = await users_repository_1.usersRepository.findByEmail(normalizedEmail);
            if (existing && existing.deletedAt === null) {
                throw new http_error_1.HttpError(409, "User with this email already exists");
            }
            if (existing && existing.deletedAt !== null) {
                const restored = await users_repository_1.usersRepository.update(existing.id, {
                    name: data.name.trim(),
                    email: normalizedEmail,
                    deletedAt: null,
                    updatedAt: new Date().toISOString()
                });
                return { item: restored };
            }
            const now = new Date().toISOString();
            const created = await users_repository_1.usersRepository.create({
                name: data.name.trim(),
                email: normalizedEmail,
                createdAt: now,
                updatedAt: now,
                deletedAt: null
            });
            return { item: created };
        }
        catch (error) {
            const message = String(error.message || "");
            if (message.includes("UNIQUE constraint failed")) {
                throw new http_error_1.HttpError(409, "User with this email already exists");
            }
            throw error;
        }
    },
    patch: async (id, data) => {
        const userId = normalizeId(id);
        const existing = await users_repository_1.usersRepository.findById(userId);
        if (!existing || existing.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "User not found");
        }
        const nextEmail = data.email ?? existing.email;
        const duplicate = await users_repository_1.usersRepository.findByEmail(nextEmail);
        if (duplicate && duplicate.id !== userId && duplicate.deletedAt === null) {
            throw new http_error_1.HttpError(409, "User with this email already exists");
        }
        const updated = await users_repository_1.usersRepository.update(userId, {
            ...data,
            updatedAt: new Date().toISOString()
        });
        if (!updated) {
            throw new http_error_1.HttpError(404, "User not found");
        }
        return {
            item: updated
        };
    },
    softDelete: async (id) => {
        const userId = normalizeId(id);
        const existing = await users_repository_1.usersRepository.findById(userId);
        if (!existing || existing.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "User not found");
        }
        const updated = await users_repository_1.usersRepository.update(userId, {
            deletedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        if (!updated) {
            throw new http_error_1.HttpError(404, "User not found");
        }
    }
};
