function validateComment(data) {
    const errors = [];

    if (!data.resourceId) errors.push("resourceId is required");
    if (!data.userId) errors.push("userId is required");

    if (!data.text) {
        errors.push("text is required");
    } else if (typeof data.text !== "string") {
        errors.push("text must be a string");
    } else if (data.text.length > 500) {
        errors.push("text max length 500 chars");
    }

    return errors;
}

module.exports = { validateComment };