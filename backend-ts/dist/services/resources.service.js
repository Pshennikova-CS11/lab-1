"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourcesService = exports.ResourcesService = void 0;
const uuid_1 = require("uuid");
const resources_dto_1 = require("../dtos/resources.dto");
const resources_repository_1 = require("../repositories/resources.repository");
const http_error_1 = require("../utils/http-error");
function normalizePage(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}
function normalizePageSize(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 10;
}
class ResourcesService {
    getAll(query) {
        const page = normalizePage(query.page);
        const pageSize = normalizePageSize(query.pageSize);
        const includeDeleted = query.includeDeleted === "true";
        let items = resources_repository_1.resourcesRepository.findAll();
        if (!includeDeleted) {
            items = items.filter((item) => item.deletedAt === null);
        }
        if (query.search) {
            const search = query.search.toLowerCase();
            items = items.filter((item) => item.title.toLowerCase().includes(search) ||
                item.description.toLowerCase().includes(search) ||
                item.author.toLowerCase().includes(search));
        }
        if (query.type) {
            const type = query.type.toLowerCase();
            items = items.filter((item) => item.type.toLowerCase() === type);
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
            items: pagedItems.map(resources_dto_1.toResourceResponseDto),
            total,
            page,
            pageSize
        };
    }
    getById(id) {
        const resource = resources_repository_1.resourcesRepository.findById(id);
        if (!resource || resource.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "Resource not found");
        }
        return {
            item: (0, resources_dto_1.toResourceResponseDto)(resource)
        };
    }
    create(dto) {
        const now = new Date().toISOString();
        const newResource = {
            id: (0, uuid_1.v4)(),
            title: dto.title,
            url: dto.url,
            type: dto.type,
            description: dto.description ?? "",
            author: dto.author,
            createdAt: now,
            updatedAt: now,
            deletedAt: null
        };
        const created = resources_repository_1.resourcesRepository.create(newResource);
        return {
            item: (0, resources_dto_1.toResourceResponseDto)(created)
        };
    }
    patch(id, dto) {
        const existing = resources_repository_1.resourcesRepository.findById(id);
        if (!existing || existing.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "Resource not found");
        }
        const updated = resources_repository_1.resourcesRepository.update(id, {
            ...dto,
            updatedAt: new Date().toISOString()
        });
        if (!updated) {
            throw new http_error_1.HttpError(404, "Resource not found");
        }
        return {
            item: (0, resources_dto_1.toResourceResponseDto)(updated)
        };
    }
    softDelete(id) {
        const existing = resources_repository_1.resourcesRepository.findById(id);
        if (!existing || existing.deletedAt !== null) {
            throw new http_error_1.HttpError(404, "Resource not found");
        }
        const updated = resources_repository_1.resourcesRepository.update(id, {
            deletedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        if (!updated) {
            throw new http_error_1.HttpError(404, "Resource not found");
        }
    }
}
exports.ResourcesService = ResourcesService;
exports.resourcesService = new ResourcesService();
