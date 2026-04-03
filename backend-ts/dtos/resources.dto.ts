import { ResourceEntity } from "../types/resource";

export interface CreateResourceDto {
    title: string;
    url: string;
    type: string;
    description?: string;
    author: string;
}

export interface PatchResourceDto {
    title?: string;
    url?: string;
    type?: string;
    description?: string;
    author?: string;
}

export interface ResourceResponseDto {
    id: string;
    title: string;
    url: string;
    type: string;
    description: string;
    author: string;
    createdAt: string;
    updatedAt: string;
}

export function toResourceResponseDto(resource: ResourceEntity): ResourceResponseDto {
    return {
        id: resource.id,
        title: resource.title,
        url: resource.url,
        type: resource.type,
        description: resource.description,
        author: resource.author,
        createdAt: resource.createdAt,
        updatedAt: resource.updatedAt
    };
}