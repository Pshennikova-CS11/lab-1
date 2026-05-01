import { resourcesRepository } from "../repositories/resources.repository";
import { HttpError } from "../utils/http-error";

type ResourceQuery = {
    type?: string;
    search?: string;
    sort?: string;
    order?: string;
    page?: string;
    pageSize?: string;
};

type ResourceInput = {
    title: string;
    url: string;
    type: string;
    description?: string;
    author: string;
};

export const resourcesService = {
    //Отримати список ресурсів (фільтри + сортування + пагінація)
    getAll: async (query: ResourceQuery) => {
        return await resourcesRepository.findAll(query);
    },

    // Отримати ресурс за ID
    getById: async (id: number) => {
        const resource = await resourcesRepository.findById(id);

        if (!resource) {
            throw new HttpError(404, "Resource not found");
        }

        return resource;
    },

    //Створення ресурсу
    create: async (data: ResourceInput) => {
        try {
            return await resourcesRepository.create(data);
        } catch (error) {
            const message = String((error as Error).message || "");

            if (message.includes("UNIQUE constraint failed")) {
                throw new HttpError(409, "Resource with this URL already exists");
            }

            if (message.includes("CHECK constraint failed")) {
                throw new HttpError(400, "Invalid resource type");
            }

            throw error;
        }
    },

    //Оновлення ресурсу
    update: async (id: number, data: ResourceInput) => {
        try {
            const updated = await resourcesRepository.update(id, data);

            if (!updated) {
                throw new HttpError(404, "Resource not found");
            }

            return updated;
        } catch (error) {
            const message = String((error as Error).message || "");

            if (message.includes("UNIQUE constraint failed")) {
                throw new HttpError(409, "Resource with this URL already exists");
            }

            if (message.includes("CHECK constraint failed")) {
                throw new HttpError(400, "Invalid resource type");
            }

            throw error;
        }
    },

    //Видалення ресурсу
    remove: async (id: number) => {
        const result = await resourcesRepository.delete(id);

        if (result.changes === 0) {
            throw new HttpError(404, "Resource not found");
        }

        return true;
    },

    // JOIN: ресурс + коментарі
    getWithComments: async (id: number) => {
        const data = await resourcesRepository.getWithComments(id);
        //викликає repository і перевіряє, чи існують дані.
        //якщо ресурс не знайдено, повертається помилка 404 Not Found.

        if (!data || data.length === 0) {
            throw new HttpError(404, "Resource not found");
        }

        return data;
    },

    // Агрегація: середній рейтинг
    getAvgRating: async (id: number) => {
        const result = await resourcesRepository.getAvgRating(id);
        return result || { avgRating: 0 };
    },

    //JOIN + фільтри + сортування (розширений endpoint)
    getWithDetails: async (query: ResourceQuery) => {
        return await resourcesRepository.getWithDetails(query);
    },
};