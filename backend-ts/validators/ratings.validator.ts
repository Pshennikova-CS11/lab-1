import { HttpError } from "../utils/http-error";

function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

function isValidRatingValue(value: unknown): value is number {
    return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
}

export function validateCreateRating(body: unknown): void {
    if (typeof body !== "object" || body === null) {
        throw new HttpError(400, "Body must be an object");
    }

    const data = body as Record<string, unknown>;

    if (!isNonEmptyString(data.resourceId)) {
        throw new HttpError(400, "Field 'resourceId' is required");
    }

    if (!isNonEmptyString(data.userId)) {
        throw new HttpError(400, "Field 'userId' is required");
    }

    if (!isValidRatingValue(data.value)) {
        throw new HttpError(400, "Field 'value' must be an integer from 1 to 5");
    }
}

export function validatePatchRating(body: unknown): void {
    if (typeof body !== "object" || body === null) {
        throw new HttpError(400, "Body must be an object");
    }

    const data = body as Record<string, unknown>;
    const keys = Object.keys(data);

    if (keys.length === 0) {
        throw new HttpError(400, "At least one field must be provided");
    }

    if (data.resourceId !== undefined && !isNonEmptyString(data.resourceId)) {
        throw new HttpError(400, "Field 'resourceId' must be a non-empty string");
    }

    if (data.userId !== undefined && !isNonEmptyString(data.userId)) {
        throw new HttpError(400, "Field 'userId' must be a non-empty string");
    }

    if (data.value !== undefined && !isValidRatingValue(data.value)) {
        throw new HttpError(400, "Field 'value' must be an integer from 1 to 5");
    }
}