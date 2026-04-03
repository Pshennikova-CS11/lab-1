import { UserEntity } from "../types/user";

class UsersRepository {
    private items: UserEntity[] = [];

    findAll(): UserEntity[] {
        return [...this.items];
    }

    findById(id: string): UserEntity | undefined {
        return this.items.find((item) => item.id === id);
    }

    findByEmail(email: string): UserEntity | undefined {
        return this.items.find((item) => item.email.toLowerCase() === email.toLowerCase());
    }

    create(user: UserEntity): UserEntity {
        this.items.push(user);
        return user;
    }

    update(id: string, changes: Partial<UserEntity>): UserEntity | null {
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

export const usersRepository = new UsersRepository();