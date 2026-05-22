type ResourceType = "article" | "video" | "course";

interface SharedResourceDto {
    id: number;
    title: string;
    url: string;
    type: ResourceType;
    author: string;
    description: string;
    createdAt?: string;
    averageRating?: number | null;
}

interface SharedResourceDto {
    id: number;
    title: string;
    url: string;
    type: ResourceType;
    author: string;
    description: string;
    createdAt?: string;
    averageRating?: number | null;

    difficulty?: "beginner" | "intermediate" | "advanced";
}

interface SharedUserDto {
    id: number;
    name: string;
    email: string;
    createdAt?: string;
}

interface SharedCreateUserDto {
    name: string;
    email: string;
}

interface SharedCommentDto {
    id: number;
    resourceId: number;
    userId: number;
    text: string;
    createdAt?: string;
}

interface SharedCreateCommentDto {
    resourceId: string | number;
    userId: string | number;
    text: string;
}

interface SharedRatingDto {
    id: number;
    resourceId: number;
    userId: number;
    value: number;
    createdAt?: string;
}

interface SharedCreateRatingDto {
    resourceId: string | number;
    userId: string | number;
    value: number;
}
