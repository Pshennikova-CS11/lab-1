import { v4 as uuidv4 } from "uuid";
import {
    CreateResourceDto,
    PatchResourceDto,
    ResourceResponseDto,
    toResourceResponseDto
} from "../dtos/resources.dto";
import { resourcesRepository } from "../repositories/resources.repository";
import { ApiItemResponse, ApiListResponse } from "../types/api";
import { ResourceEntity, ResourceListQuery } from "../types/resource";
import { HttpError } from "../utils/http-error";

function normalizePage(value?: string): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function normalizePageSize(value?: string): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 10;
}

export class ResourcesService {
    getAll(query: ResourceListQuery): ApiListResponse<ResourceResponseDto> {
        const page = normalizePage(query.page);
        const pageSize = normalizePageSize(query.pageSize);
        const includeDeleted = query.includeDeleted === "true";

        let items = resourcesRepository.findAll();

        if (!includeDeleted) {
            items = items.filter((item) => item.deletedAt === null);
        }

        if (query.search) {
            const search = query.search.toLowerCase();
            items = items.filter((item) =>
                item.title.toLowerCase().includes(search) ||
                item.description.toLowerCase().includes(search) ||
                item.author.toLowerCase().includes(search)
            );
        }

        if (query.type) {
            const type = query.type.toLowerCase();
            items = items.filter((item) => item.type.toLowerCase() === type);
        }

        if (query.sortBy) {
            const sortDir = query.sortDir === "desc" ? -1 : 1;

            items.sort((a, b) => {
                const left = String(a[query.sortBy as keyof ResourceEntity] ?? "").toLowerCase();
                const right = String(b[query.sortBy as keyof ResourceEntity] ?? "").toLowerCase();

                if (left < right) return -1 * sortDir;
                if (left > right) return 1 * sortDir;
                return 0;
            });
        }

        const total = items.length;
        const start = (page - 1) * pageSize;
        const pagedItems = items.slice(start, start + pageSize);

        return {
            items: pagedItems.map(toResourceResponseDto),
            total,
            page,
            pageSize
        };
    }

    getById(id: string): ApiItemResponse<ResourceResponseDto> {
        const resource = resourcesRepository.findById(id);

        if (!resource || resource.deletedAt !== null) {
            throw new HttpError(404, "Resource not found");
        }

        return {
            item: toResourceResponseDto(resource)
        };
    }

    create(dto: CreateResourceDto): ApiItemResponse<ResourceResponseDto> {
        const now = new Date().toISOString();

        const newResource: ResourceEntity = {
            id: uuidv4(),
            title: dto.title,
            url: dto.url,
            type: dto.type,
            description: dto.description ?? "",
            author: dto.author,
            createdAt: now,
            updatedAt: now,
            deletedAt: null
        };

        const created = resourcesRepository.create(newResource);

        return {
            item: toResourceResponseDto(created)
        };
    }

    patch(id: string, dto: PatchResourceDto): ApiItemResponse<ResourceResponseDto> {
        const existing = resourcesRepository.findById(id);

        if (!existing || existing.deletedAt !== null) {
            throw new HttpError(404, "Resource not found");
        }

        const updated = resourcesRepository.update(id, {
            ...dto,
            updatedAt: new Date().toISOString()
        });

        if (!updated) {
            throw new HttpError(404, "Resource not found");
        }

        return {
            item: toResourceResponseDto(updated)
        };
    }

    softDelete(id: string): void {
        const existing = resourcesRepository.findById(id);

        if (!existing || existing.deletedAt !== null) {
            throw new HttpError(404, "Resource not found");
        }

        const updated = resourcesRepository.update(id, {
            deletedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        if (!updated) {
            throw new HttpError(404, "Resource not found");
        }
    }
}

export const resourcesService = new ResourcesService();