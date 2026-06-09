"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourcesService = void 0;
const resources_repository_1 = require("../repositories/resources.repository");
const http_error_1 = require("../utils/http-error");
exports.resourcesService = {
    //Отримати список ресурсів (фільтри + сортування + пагінація)
    getAll: async (query) => {
        return await resources_repository_1.resourcesRepository.findAll(query);
    },
    // Отримати ресурс за ID
    getById: async (id) => {
        const resource = await resources_repository_1.resourcesRepository.findById(id);
        if (!resource) {
            throw new http_error_1.HttpError(404, "Resource not found");
        }
        return resource;
    },
    //Створення ресурсу
    create: async (data) => {
        try {
            return await resources_repository_1.resourcesRepository.create(data);
        }
        catch (error) {
            const message = String(error.message || "");
            if (message.includes("UNIQUE constraint failed")) {
                throw new http_error_1.HttpError(409, "Resource with this URL already exists");
            }
            if (message.includes("CHECK constraint failed")) {
                throw new http_error_1.HttpError(400, "Invalid resource type");
            }
            throw error;
        }
    },
    //Оновлення ресурсу
    update: async (id, data) => {
        try {
            const updated = await resources_repository_1.resourcesRepository.update(id, data);
            if (!updated) {
                throw new http_error_1.HttpError(404, "Resource not found");
            }
            return updated;
        }
        catch (error) {
            const message = String(error.message || "");
            if (message.includes("UNIQUE constraint failed")) {
                throw new http_error_1.HttpError(409, "Resource with this URL already exists");
            }
            if (message.includes("CHECK constraint failed")) {
                throw new http_error_1.HttpError(400, "Invalid resource type");
            }
            throw error;
        }
    },
    //Видалення ресурсу
    remove: async (id) => {
        const result = await resources_repository_1.resourcesRepository.delete(id);
        if (result.changes === 0) {
            throw new http_error_1.HttpError(404, "Resource not found");
        }
        return true;
    },
    // JOIN: ресурс + коментарі
    getWithComments: async (id) => {
        const data = await resources_repository_1.resourcesRepository.getWithComments(id);
        //викликає repository і перевіряє, чи існують дані.
        //якщо ресурс не знайдено, повертається помилка 404 Not Found.
        if (!data || data.length === 0) {
            throw new http_error_1.HttpError(404, "Resource not found");
        }
        return data;
    },
    // Агрегація: середній рейтинг
    getAvgRating: async (id) => {
        const result = await resources_repository_1.resourcesRepository.getAvgRating(id);
        return result || { avgRating: 0 };
    },
    //JOIN + фільтри + сортування (розширений endpoint)
    getWithDetails: async (query) => {
        return await resources_repository_1.resourcesRepository.getWithDetails(query);
    },
};
