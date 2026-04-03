function validateRating(data) {
    const errors = [];

    if (!data.resourceId) errors.push("resourceId is required");
    if (!data.userId) errors.push("userId is required");

    if (data.value === undefined) {
        errors.push("value is required");
    } else if (typeof data.value !== "number") {
        errors.push("value must be a number");
    } else if (data.value < 1 || data.value > 5) {
        errors.push("value must be 1-5");
    }

    return errors;
}

module.exports = { validateRating };