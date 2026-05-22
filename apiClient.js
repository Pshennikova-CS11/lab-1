const API_BASE_URL = "http://localhost:3000/api/v1";

async function fetchJson(url, options = {}) {
    let response;

    try {
        response = await fetch(url, options);
    } catch (error) {
        return {
            ok: false,
            error: {
                status: 0,
                message: "Помилка мережі або CORS",
                details: error.message
            }
        };
    }

    if (response.status === 204) {
        return { ok: true, data: null };
    }

    const text = await response.text();

    let data = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!response.ok) {
        return {
            ok: false,
            error: {
                status: response.status,
                message: data?.error?.message || data?.message || "HTTP помилка",
                details: data
            }
        };
    }

    return { ok: true, data };
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