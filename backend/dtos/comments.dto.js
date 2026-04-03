function toCommentResponseDto(comment) {
    return {
        id: comment.id,
        resourceId: comment.resourceId,
        userId: comment.userId,
        text: comment.text
    };
}

module.exports = { toCommentResponseDto };