const { v4: uuidv4 } = require("uuid");
const { validateResource } = require("../validators/resources.validator");

let resources = [];

/* GET list з query params: реалізовано фільтрацію та сортування */
function getAllResources(query) {
    let result = [...resources];

    /* Фільтрація за типом */
    if (query.type) {
        result = result.filter(r => r.type === query.type);
    }

    /* Фільтрація за автором */
    if (query.author) {
        result = result.filter(r =>
            r.author.toLowerCase().includes(query.author.toLowerCase())
        );
    }

    /* Сортування за датою створення */
    if (query.sortBy === "createdAt") {
        const order = query.order === "asc" ? 1 : -1;
        result.sort((a, b) => (a.createdAt - b.createdAt) * order);
    }

    return result;
}

function getResourceById(id) {
    const resource = resources.find(r => r.id === id);

    if (!resource) {
        throw {
            code: "NOT_FOUND",
            message: "Resource not found",
            status: 404
        };
    }

    return resource;
}

function createResource(data) {
    const errors = validateResource(data);

    if (errors.length) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        };
    }

    const resource = {
        id: uuidv4(),
        title: data.title,
        url: data.url,
        type: data.type,
        description: data.description || "",
        author: data.author,
        createdAt: Date.now()
    };

    resources.push(resource);

    return resource;
}

function updateResource(id, data) {
    const resource = resources.find(r => r.id === id);

    if (!resource) {
        throw {
            code: "NOT_FOUND",
            message: "Resource not found",
            status: 404
        };
    }

    const errors = validateResource(data);

    if (errors.length) {
        throw {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: errors,
            status: 400
        };
    }

    resource.title = data.title;
    resource.url = data.url;
    resource.type = data.type;
    resource.description = data.description || "";
    resource.author = data.author;

    return resource;
}

function deleteResource(id) {
    const exists = resources.some(r => r.id === id);

    if (!exists) {
        throw {
            code: "NOT_FOUND",
            message: "Resource not found",
            status: 404
        };
    }

    resources = resources.filter(r => r.id !== id);
}

module.exports = {
    getAllResources,
    getResourceById,
    createResource,
    updateResource,
    deleteResource
};