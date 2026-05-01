"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateRating = validateCreateRating;
exports.validatePatchRating = validatePatchRating;
const http_error_1 = require("../utils/http-error");
function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}
function isValidRatingValue(value) {
    return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
}
function validateCreateRating(body) {
    if (typeof body !== "object" || body === null) {
        throw new http_error_1.HttpError(400, "Body must be an object");
    }
    const data = body;
    if (!isNonEmptyString(data.resourceId)) {
        throw new http_error_1.HttpError(400, "Field 'resourceId' is required");
    }
    if (!isNonEmptyString(data.userId)) {
        throw new http_error_1.HttpError(400, "Field 'userId' is required");
    }
    if (!isValidRatingValue(data.value)) {
        throw new http_error_1.HttpError(400, "Field 'value' must be an integer from 1 to 5");
    }
}
function validatePatchRating(body) {
    if (typeof body !== "object" || body === null) {
        throw new http_error_1.HttpError(400, "Body must be an object");
    }
    const data = body;
    const keys = Object.keys(data);
    if (keys.length === 0) {
        throw new http_error_1.HttpError(400, "At least one field must be provided");
    }
    if (data.resourceId !== undefined && !isNonEmptyString(data.resourceId)) {
        throw new http_error_1.HttpError(400, "Field 'resourceId' must be a non-empty string");
    }
    if (data.userId !== undefined && !isNonEmptyString(data.userId)) {
        throw new http_error_1.HttpError(400, "Field 'userId' must be a non-empty string");
    }
    if (data.value !== undefined && !isValidRatingValue(data.value)) {
        throw new http_error_1.HttpError(400, "Field 'value' must be an integer from 1 to 5");
    }
}
