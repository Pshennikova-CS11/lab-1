import { NextFunction, Request, Response } from "express";
import { CreateResourceDto, PatchResourceDto, ResourceResponseDto } from "../dtos/resources.dto";
import { resourcesService } from "../services/resources.service";
import { ApiItemResponse, ApiListResponse } from "../types/api";
import { ResourceListQuery } from "../types/resource";

export function getResources(
    req: Request<{}, ApiListResponse<ResourceResponseDto>, never, ResourceListQuery>,
    res: Response<ApiListResponse<ResourceResponseDto>>,
    next: NextFunction
): void {
    try {
        const result = resourcesService.getAll(req.query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export function getResourceById(
    req: Request<{ id: string }, ApiItemResponse<ResourceResponseDto>>,
    res: Response<ApiItemResponse<ResourceResponseDto>>,
    next: NextFunction
): void {
    try {
        const result = resourcesService.getById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export function createResource(
    req: Request<{}, ApiItemResponse<ResourceResponseDto>, CreateResourceDto>,
    res: Response<ApiItemResponse<ResourceResponseDto>>,
    next: NextFunction
): void {
    try {
        const result = resourcesService.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

export function patchResource(
    req: Request<{ id: string }, ApiItemResponse<ResourceResponseDto>, PatchResourceDto>,
    res: Response<ApiItemResponse<ResourceResponseDto>>,
    next: NextFunction
): void {
    try {
        const result = resourcesService.patch(req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export function deleteResource(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): void {
    try {
        resourcesService.softDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}