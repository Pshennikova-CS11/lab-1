"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRepository = void 0;
class CommentsRepository {
    constructor() {
        this.items = [];
    }
    findAll() {
        return [...this.items];
    }
    findById(id) {
        return this.items.find((item) => item.id === id);
    }
    create(comment) {
        this.items.push(comment);
        return comment;
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
exports.commentsRepository = new CommentsRepository();
