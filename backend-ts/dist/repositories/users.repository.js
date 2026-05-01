"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRepository = void 0;
class UsersRepository {
    constructor() {
        this.items = [];
    }
    findAll() {
        return [...this.items];
    }
    findById(id) {
        return this.items.find((item) => item.id === id);
    }
    findByEmail(email) {
        return this.items.find((item) => item.email.toLowerCase() === email.toLowerCase());
    }
    create(user) {
        this.items.push(user);
        return user;
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
exports.usersRepository = new UsersRepository();
