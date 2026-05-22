"use strict";
/// <reference path="./types.ts" />
const API_BASE_URL = "http://localhost:3000/api/v1";
const REQUEST_TIMEOUT_MS = 15000;
async function fetchJson(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
        controller.abort();
    }, REQUEST_TIMEOUT_MS);
    let response;
    try {
        response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
    }
    catch (error) {
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
    }
    finally {
        window.clearTimeout(timeoutId);
    }
    if (response.status === 204) {
        return {
            ok: true,
            data: null
        };
    }
    const text = await response.text();
    let data = null;
    try {
        data = text ? JSON.parse(text) : null;
    }
    catch {
        data = text;
    }
    if (!response.ok) {
        const backendError = data;
        return {
            ok: false,
            error: {
                status: response.status,
                message: backendError?.error?.message ||
                    `HTTP помилка ${response.status}`,
                details: data
            }
        };
    }
    return {
        ok: true,
        data: data
    };
}
function createCrudClient(resourceName) {
    const baseUrl = `${API_BASE_URL}/${resourceName}`;
    return {
        getList() {
            return fetchJson(baseUrl);
        },
        getById(id) {
            return fetchJson(`${baseUrl}/${id}`);
        },
        create(data) {
            return fetchJson(baseUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        },
        update(id, data) {
            return fetchJson(`${baseUrl}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        },
        remove(id) {
            return fetchJson(`${baseUrl}/${id}`, {
                method: "DELETE"
            });
        }
    };
}
window.resourcesApi = createCrudClient("resources");
window.usersApi = createCrudClient("users");
window.commentsApi = createCrudClient("comments");
window.ratingsApi = createCrudClient("ratings");
