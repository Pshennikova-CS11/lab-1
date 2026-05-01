"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingsRepository = void 0;
class RatingsRepository {
    constructor() {
        this.items = [];
    }
    findAll() {
        return [...this.items];
    }
    findById(id) {
        return this.items.find((item) => item.id === id);
    }
    findByUserAndResource(userId, resourceId) {
        return this.items.find((item) => item.userId === userId && item.resourceId === resourceId);
    }
    create(rating) {
        this.items.push(rating);
        return rating;
    }
    update(id, changes) {
        const index = this.items.findIndex((item) => item.id === id);
        if (index === -1) {
            return null;
        }
        const updated = {
            ...this.items[index],
            ...changes
        };
        this.items[index] = updated;
        return updated;
    }
}
exports.ratingsRepository = new RatingsRepository();
