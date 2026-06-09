"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateResource = validateCreateResource;
exports.validatePatchResource = validatePatchResource;
exports.asCreateResourceDto = asCreateResourceDto;
exports.asPatchResourceDto = asPatchResourceDto;
const http_error_1 = require("../utils/http-error");
function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}
function isValidUrl(value) {
    try {
        new URL(value);
        return true;
    }
    catch {
        return false;
    }
}
function validateCreateResource(body) {
    if (typeof body !== "object" || body === null) {
        throw new http_error_1.HttpError(400, "Body must be an object");
    }
    const data = body;
    if (!isNonEmptyString(data.title)) {
        throw new http_error_1.HttpError(400, "Field 'title' is required");
    }
    if (!isNonEmptyString(data.url) || !isValidUrl(data.url)) {
        throw new http_error_1.HttpError(400, "Field 'url' must be a valid URL");
    }
    if (!isNonEmptyString(data.type)) {
        throw new http_error_1.HttpError(400, "Field 'type' is required");
    }
    if (!isNonEmptyString(data.author)) {
        throw new http_error_1.HttpError(400, "Field 'author' is required");
    }
    if (data.description !== undefined && typeof data.description !== "string") {
        throw new http_error_1.HttpError(400, "Field 'description' must be a string");
    }
}
function validatePatchResource(body) {
    if (typeof body !== "object" || body === null) {
        throw new http_error_1.HttpError(400, "Body must be an object");
    }
    const data = body;
    const keys = Object.keys(data);
    if (keys.length === 0) {
        throw new http_error_1.HttpError(400, "At least one field must be provided");
    }
    if (data.title !== undefined && !isNonEmptyString(data.title)) {
        throw new http_error_1.HttpError(400, "Field 'title' must be a non-empty string");
    }
    if (data.url !== undefined) {
        if (!isNonEmptyString(data.url) || !isValidUrl(data.url)) {
            throw new http_error_1.HttpError(400, "Field 'url' must be a valid URL");
        }
    }
    if (data.type !== undefined && !isNonEmptyString(data.type)) {
        throw new http_error_1.HttpError(400, "Field 'type' must be a non-empty string");
    }
    if (data.author !== undefined && !isNonEmptyString(data.author)) {
        throw new http_error_1.HttpError(400, "Field 'author' must be a non-empty string");
    }
    if (data.description !== undefined && typeof data.description !== "string") {
        throw new http_error_1.HttpError(400, "Field 'description' must be a string");
    }
}
function asCreateResourceDto(body) {
    validateCreateResource(body);
    return body;
}
function asPatchResourceDto(body) {
    validatePatchResource(body);
    return body;
}
