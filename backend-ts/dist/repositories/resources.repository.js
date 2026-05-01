"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourcesRepository = void 0;
class ResourcesRepository {
    constructor() {
        this.items = [];
    }
    findAll() {
        return [...this.items];
    }
    findById(id) {
        return this.items.find((item) => item.id === id);
    }
    create(resource) {
        this.items.push(resource);
        return resource;
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
exports.resourcesRepository = new ResourcesRepository();
