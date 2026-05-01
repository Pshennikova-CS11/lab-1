"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCommentResponseDto = toCommentResponseDto;
function toCommentResponseDto(comment) {
    return {
        id: comment.id,
        resourceId: comment.resourceId,
        userId: comment.userId,
        text: comment.text,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt
    };
}
