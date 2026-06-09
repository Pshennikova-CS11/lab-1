"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRatingResponseDto = toRatingResponseDto;
function toRatingResponseDto(rating) {
    return {
        id: rating.id,
        resourceId: rating.resourceId,
        userId: rating.userId,
        value: rating.value,
        createdAt: rating.createdAt,
        updatedAt: rating.updatedAt
    };
}
