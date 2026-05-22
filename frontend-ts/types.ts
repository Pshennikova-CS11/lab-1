/// <reference path="../shared/dto.types.ts" />

type ResourceDto = SharedResourceDto;
type CreateResourceDto = SharedCreateResourceDto;

type UserDto = SharedUserDto;
type CreateUserDto = SharedCreateUserDto;

type CommentDto = SharedCommentDto;
type CreateCommentDto = SharedCreateCommentDto;

type RatingDto = SharedRatingDto;
type CreateRatingDto = SharedCreateRatingDto;

interface BackendErrorResponse {
    error?: {
        code?: string;
        message?: string;
        details?: string[] | null;
    };
}

interface BackendErrorDto {
    error: {
        code: string;
        message: string;
        details?: string[] | null;
    };
}

interface ApiError {
    status: number;
    message: string;
    details: unknown;
}

type ApiResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: ApiError };

interface CrudClient<TDto, TCreateDto, TUpdateDto = TCreateDto> {
    getList(): Promise<ApiResult<TDto[]>>;
    getById(id: number | string): Promise<ApiResult<TDto>>;
    create(data: TCreateDto): Promise<ApiResult<TDto>>;
    update(id: number | string, data: TUpdateDto): Promise<ApiResult<TDto>>;
    remove(id: number | string): Promise<ApiResult<null>>;
}

interface AppState {
    resources: ResourceDto[];
    users: UserDto[];
    comments: CommentDto[];
    ratings: RatingDto[];
}

interface Window {
    resourcesApi: CrudClient<ResourceDto, CreateResourceDto>;
    usersApi: CrudClient<UserDto, CreateUserDto>;
    commentsApi: CrudClient<CommentDto, CreateCommentDto>;
    ratingsApi: CrudClient<RatingDto, CreateRatingDto>;
}