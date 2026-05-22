/// <reference path="./types.ts" />

const API_BASE_URL = "http://localhost:3000/api/v1";
const REQUEST_TIMEOUT_MS = 15000;

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<ApiResult<T>> {
    const controller = new AbortController();

    const timeoutId = window.setTimeout(() => {
        controller.abort();
    }, REQUEST_TIMEOUT_MS);

    let response: Response;

    try {
        response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
    } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
            return {
                ok: false,
                error: {
                    status: 0,
                    message: "Сервер не відповідає понад 15 секунд. Перевірте, чи запущений backend, і спробуйте ще раз.",
                    details: null
                }
            };
        }

        return {
            ok: false,
            error: {
                status: 0,
                message: "Помилка мережі або CORS. Перевірте, чи запущений backend і чи дозволений origin frontend.",
                details: error instanceof Error ? error.message : String(error)
            }
        };
    } finally {
        window.clearTimeout(timeoutId);
    }

    if (response.status === 204) {
        return {
            ok: true,
            data: null as T
        };
    }

    const text = await response.text();

    let data: unknown = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!response.ok) {
        const backendError = data as BackendErrorResponse | null;

        return {
            ok: false,
            error: {
                status: response.status,
                message:
                    backendError?.error?.message ||
                    `HTTP помилка ${response.status}`,
                details: data
            }
        };
    }

    return {
        ok: true,
        data: data as T
    };
}

function createCrudClient<TDto, TCreateDto, TUpdateDto = TCreateDto>(
    resourceName: string
): CrudClient<TDto, TCreateDto, TUpdateDto> {
    const baseUrl = `${API_BASE_URL}/${resourceName}`;

    return {
        getList(): Promise<ApiResult<TDto[]>> {
            return fetchJson<TDto[]>(baseUrl);
        },

        getById(id: number | string): Promise<ApiResult<TDto>> {
            return fetchJson<TDto>(`${baseUrl}/${id}`);
        },

        create(data: TCreateDto): Promise<ApiResult<TDto>> {
            return fetchJson<TDto>(baseUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        },

        update(id: number | string, data: TUpdateDto): Promise<ApiResult<TDto>> {
            return fetchJson<TDto>(`${baseUrl}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        },

        remove(id: number | string): Promise<ApiResult<null>> {
            return fetchJson<null>(`${baseUrl}/${id}`, {
                method: "DELETE"
            });
        }
    };
}

window.resourcesApi = createCrudClient<ResourceDto, CreateResourceDto>("resources");
window.usersApi = createCrudClient<UserDto, CreateUserDto>("users");
window.commentsApi = createCrudClient<CommentDto, CreateCommentDto>("comments");
window.ratingsApi = createCrudClient<RatingDto, CreateRatingDto>("ratings");