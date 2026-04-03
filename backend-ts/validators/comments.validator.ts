import { HttpError } from "../utils/http-error";

function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

export function validateCreateComment(body: unknown): void {
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

    if (!isNonEmptyString(data.text)) {
        throw new HttpError(400, "Field 'text' is required");
    }
}

export function validatePatchComment(body: unknown): void {
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

    if (data.text !== undefined && !isNonEmptyString(data.text)) {
        throw new HttpError(400, "Field 'text' must be a non-empty string");
    }
}