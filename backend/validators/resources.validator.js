function validateResource(data) {
    const errors = [];

    if (!data.title) {
        errors.push("title is required");
    } else if (typeof data.title !== "string") {
        errors.push("title must be a string");
    } else if (data.title.trim().length < 3 || data.title.trim().length > 100) {
        errors.push("title must be between 3 and 100 characters");
    }

    if (!data.url) {
        errors.push("url is required");
    } else if (typeof data.url !== "string") {
        errors.push("url must be a string");
    } else {
        try {
            new URL(data.url);
        } catch {
            errors.push("url must be valid");
        }
    }

    if (!data.type) {
        errors.push("type is required");
    } else if (!["article", "video", "course"].includes(data.type)) {
        errors.push("type must be one of article, video, course");
    }

    if (!data.author) {
        errors.push("author is required");
    } else if (typeof data.author !== "string") {
        errors.push("author must be a string");
    } else if (data.author.trim().length < 2 || data.author.trim().length > 50) {
        errors.push("author must be between 2 and 50 characters");
    }

    if (!data.description) {
        errors.push("description is required");
    } else if (typeof data.description !== "string") {
        errors.push("description must be a string");
    } else if (data.description.trim().length < 5 || data.description.trim().length > 500) {
        errors.push("description must be between 5 and 500 characters");
    }

    return errors;
}

module.exports = { validateResource };