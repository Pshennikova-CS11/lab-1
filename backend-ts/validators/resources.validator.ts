import { CreateResourceDto, PatchResourceDto } from "../dtos/resources.dto";
import { HttpError } from "../utils/http-error";

function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

function isValidUrl(value: string): boolean {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
}

export function validateCreateResource(body: unknown): void {
    if (typeof body !== "object" || body === null) {
        throw new HttpError(400, "Body must be an object");
    }

    const data = body as Record<string, unknown>;

    if (!isNonEmptyString(data.title)) {
        throw new HttpError(400, "Field 'title' is required");
    }

    if (!isNonEmptyString(data.url) || !isValidUrl(data.url)) {
        throw new HttpError(400, "Field 'url' must be a valid URL");
    }

    if (!isNonEmptyString(data.type)) {
        throw new HttpError(400, "Field 'type' is required");
    }

    if (!isNonEmptyString(data.author)) {
        throw new HttpError(400, "Field 'author' is required");
    }

    if (data.description !== undefined && typeof data.description !== "string") {
        throw new HttpError(400, "Field 'description' must be a string");
    }
}

export function validatePatchResource(body: unknown): void {
    if (typeof body !== "object" || body === null) {
        throw new HttpError(400, "Body must be an object");
    }

    const data = body as Record<string, unknown>;
    const keys = Object.keys(data);

    if (keys.length === 0) {
        throw new HttpError(400, "At least one field must be provided");
    }

    if (data.title !== undefined && !isNonEmptyString(data.title)) {
        throw new HttpError(400, "Field 'title' must be a non-empty string");
    }

    if (data.url !== undefined) {
        if (!isNonEmptyString(data.url) || !isValidUrl(data.url)) {
            throw new HttpError(400, "Field 'url' must be a valid URL");
        }
    }

    if (data.type !== undefined && !isNonEmptyString(data.type)) {
        throw new HttpError(400, "Field 'type' must be a non-empty string");
    }

    if (data.author !== undefined && !isNonEmptyString(data.author)) {
        throw new HttpError(400, "Field 'author' must be a non-empty string");
    }

    if (data.description !== undefined && typeof data.description !== "string") {
        throw new HttpError(400, "Field 'description' must be a string");
    }
}

export function asCreateResourceDto(body: unknown): CreateResourceDto {
    validateCreateResource(body);
    return body as CreateResourceDto;
}

export function asPatchResourceDto(body: unknown): PatchResourceDto {
    validatePatchResource(body);
    return body as PatchResourceDto;
}