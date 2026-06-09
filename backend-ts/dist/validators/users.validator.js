"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateUser = validateCreateUser;
exports.validatePatchUser = validatePatchUser;
const http_error_1 = require("../utils/http-error");
function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}
function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function validateCreateUser(body) {
    if (typeof body !== "object" || body === null) {
        throw new http_error_1.HttpError(400, "Body must be an object");
    }
    const data = body;
    if (!isNonEmptyString(data.name)) {
        throw new http_error_1.HttpError(400, "Field 'name' is required");
    }
    if (!isNonEmptyString(data.email) || !isValidEmail(data.email)) {
        throw new http_error_1.HttpError(400, "Field 'email' must be a valid email");
    }
}
function validatePatchUser(body) {
    if (typeof body !== "object" || body === null) {
        throw new http_error_1.HttpError(400, "Body must be an object");
    }
    const data = body;
    const keys = Object.keys(data);
    if (keys.length === 0) {
        throw new http_error_1.HttpError(400, "At least one field must be provided");
    }
    if (data.name !== undefined && !isNonEmptyString(data.name)) {
        throw new http_error_1.HttpError(400, "Field 'name' must be a non-empty string");
    }
    if (data.email !== undefined) {
        if (!isNonEmptyString(data.email) || !isValidEmail(data.email)) {
            throw new http_error_1.HttpError(400, "Field 'email' must be a valid email");
        }
    }
}
