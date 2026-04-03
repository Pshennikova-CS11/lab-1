import { HttpError } from "../utils/http-error";

function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateCreateUser(body: unknown): void {
    if (typeof body !== "object" || body === null) {
        throw new HttpError(400, "Body must be an object");
    }

    const data = body as Record<string, unknown>;

    if (!isNonEmptyString(data.name)) {
        throw new HttpError(400, "Field 'name' is required");
    }

    if (!isNonEmptyString(data.email) || !isValidEmail(data.email)) {
        throw new HttpError(400, "Field 'email' must be a valid email");
    }
}

export function validatePatchUser(body: unknown): void {
    if (typeof body !== "object" || body === null) {
        throw new HttpError(400, "Body must be an object");
    }

    const data = body as Record<string, unknown>;
    const keys = Object.keys(data);

    if (keys.length === 0) {
        throw new HttpError(400, "At least one field must be provided");
    }

    if (data.name !== undefined && !isNonEmptyString(data.name)) {
        throw new HttpError(400, "Field 'name' must be a non-empty string");
    }

    if (data.email !== undefined) {
        if (!isNonEmptyString(data.email) || !isValidEmail(data.email)) {
            throw new HttpError(400, "Field 'email' must be a valid email");
        }
    }
}