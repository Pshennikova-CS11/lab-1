import { UserEntity } from "../types/user";

export interface CreateUserDto {
    name: string;
    email: string;
}

export interface PatchUserDto {
    name?: string;
    email?: string;
}

export interface UserResponseDto {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export function toUserResponseDto(user: UserEntity): UserResponseDto {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}