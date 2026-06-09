"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserResponseDto = toUserResponseDto;
function toUserResponseDto(user) {
    return {
        id: Number(user.id),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}
