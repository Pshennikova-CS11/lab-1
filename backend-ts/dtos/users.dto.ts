import { UserEntity } from "../types/user";

export interface CreateUserDto {
    name: string;
    email: string;
}

// Змінюємо PatchUserDto на UpdateUserDto для синхронізації з сервісом
export interface UpdateUserDto {
    name?: string;
    email?: string;
}

export interface UserResponseDto {
    id: number; // SQLite INTEGER = number
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export function toUserResponseDto(user: UserEntity): UserResponseDto {
    return {
        id: Number(user.id),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}