import { v4 as uuidv4 } from "uuid";
import {
    CreateUserDto,
    PatchUserDto,
    UserResponseDto,
    toUserResponseDto
} from "../dtos/users.dto";
import { usersRepository } from "../repositories/users.repository";
import { ApiItemResponse, ApiListResponse } from "../types/api";
import { UserEntity, UserListQuery } from "../types/user";
import { HttpError } from "../utils/http-error";

function normalizePage(value?: string): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function normalizePageSize(value?: string): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 10;
}

export class UsersService {
    getAll(query: UserListQuery): ApiListResponse<UserResponseDto> {
        const page = normalizePage(query.page);
        const pageSize = normalizePageSize(query.pageSize);
        const includeDeleted = query.includeDeleted === "true";

        let items = usersRepository.findAll();

        if (!includeDeleted) {
            items = items.filter((item) => item.deletedAt === null);
        }

        if (query.search) {
            const search = query.search.toLowerCase();
            items = items.filter(
                (item) =>
                    item.name.toLowerCase().includes(search) ||
                    item.email.toLowerCase().includes(search)
            );
        }

        const total = items.length;
        const start = (page - 1) * pageSize;
        const pagedItems = items.slice(start, start + pageSize);

        return {
            items: pagedItems.map(toUserResponseDto),
            total,
            page,
            pageSize
        };
    }

    getById(id: string): ApiItemResponse<UserResponseDto> {
        const user = usersRepository.findById(id);

        if (!user || user.deletedAt !== null) {
            throw new HttpError(404, "User not found");
        }

        return {
            item: toUserResponseDto(user)
        };
    }

    create(dto: CreateUserDto): ApiItemResponse<UserResponseDto> {
        const existing = usersRepository.findByEmail(dto.email);

        if (existing && existing.deletedAt === null) {
            throw new HttpError(409, "User with this email already exists");
        }

        const now = new Date().toISOString();

        const newUser: UserEntity = {
            id: uuidv4(),
            name: dto.name,
            email: dto.email,
            createdAt: now,
            updatedAt: now,
            deletedAt: null
        };

        const created = usersRepository.create(newUser);

        return {
            item: toUserResponseDto(created)
        };
    }

    patch(id: string, dto: PatchUserDto): ApiItemResponse<UserResponseDto> {
        const existing = usersRepository.findById(id);

        if (!existing || existing.deletedAt !== null) {
            throw new HttpError(404, "User not found");
        }

        if (dto.email && dto.email !== existing.email) {
            const duplicate = usersRepository.findByEmail(dto.email);

            if (duplicate && duplicate.id !== id && duplicate.deletedAt === null) {
                throw new HttpError(409, "User with this email already exists");
            }
        }

        const updated = usersRepository.update(id, {
            ...dto,
            updatedAt: new Date().toISOString()
        });

        if (!updated) {
            throw new HttpError(404, "User not found");
        }

        return {
            item: toUserResponseDto(updated)
        };
    }

    softDelete(id: string): void {
        const existing = usersRepository.findById(id);

        if (!existing || existing.deletedAt !== null) {
            throw new HttpError(404, "User not found");
        }

        const updated = usersRepository.update(id, {
            deletedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        if (!updated) {
            throw new HttpError(404, "User not found");
        }
    }
}

export const usersService = new UsersService();