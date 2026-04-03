function toRatingResponseDto(rating) {
    return {
        id: rating.id,
        resourceId: rating.resourceId,
        userId: rating.userId,
        value: rating.value
    };
}

module.exports = { toRatingResponseDto };