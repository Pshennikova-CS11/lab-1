function validateUser(data) {
    const errors = [];

    if (!data.name) {
        errors.push("name is required");
    } else if (typeof data.name !== "string") {
        errors.push("name must be a string");
    } else if (data.name.trim().length < 2 || data.name.trim().length > 50) {
        errors.push("name must be between 2 and 50 characters");
    }

    if (!data.email) {
        errors.push("email is required");
    } else if (typeof data.email !== "string") {
        errors.push("email must be a string");
    } else if (!data.email.includes("@")) {
        errors.push("email must be valid");
    }

    return errors;
}

module.exports = { validateUser };