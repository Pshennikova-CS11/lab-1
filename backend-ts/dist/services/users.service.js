"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = exports.UsersService = void 0;
const uuid_1 = require("uuid");
const users_dto_1 = require("../dtos/users.dto");
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
class UsersService {
    getAll(query) {
        const page = normalizePage(query.page);
        const pageSize = normalizePageSize(query.pageSize);
        const includeDeleted = query.includeDeleted === "true";
        let items = users_repository_1.usersRepository.findAll();
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
            items: pagedItems.map(users_dto_1.toUserResponseDto),
            total,
            page,
            pageSize
        };
    }
    getById(id) {
        const user = users_repository_1.usersRepository.findById(id);
        if (!user || user.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "User not found");
        }
        return {
            item: (0, users_dto_1.toUserResponseDto)(user)
        };
    }
    create(dto) {
        const existing = users_repository_1.usersRepository.findByEmail(dto.email);
        if (existing && existing.deletedAt === null) {
            throw new http_error_1.HttpError(409, "User with this email already exists");
        }
        const now = new Date().toISOString();
        const newUser = {
            id: (0, uuid_1.v4)(),
            name: dto.name,
            email: dto.email,
            createdAt: now,
            updatedAt: now,
            deletedAt: null
        };
        const created = users_repository_1.usersRepository.create(newUser);
        return {
            item: (0, users_dto_1.toUserResponseDto)(created)
        };
    }
    patch(id, dto) {
        const existing = users_repository_1.usersRepository.findById(id);
        if (!existing || existing.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "User not found");
        }
        if (dto.email && dto.email !== existing.email) {
            const duplicate = users_repository_1.usersRepository.findByEmail(dto.email);
            if (duplicate && duplicate.id !== id && duplicate.deletedAt === null) {
                throw new http_error_1.HttpError(409, "User with this email already exists");
            }
        }
        const updated = users_repository_1.usersRepository.update(id, {
            ...dto,
            updatedAt: new Date().toISOString()
        });
        if (!updated) {
            throw new http_error_1.HttpError(404, "User not found");
        }
        return {
            item: (0, users_dto_1.toUserResponseDto)(updated)
        };
    }
    softDelete(id) {
        const existing = users_repository_1.usersRepository.findById(id);
        if (!existing || existing.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "User not found");
        }
        const updated = users_repository_1.usersRepository.update(id, {
            deletedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        if (!updated) {
            throw new http_error_1.HttpError(404, "User not found");
        }
    }
}
exports.UsersService = UsersService;
exports.usersService = new UsersService();
