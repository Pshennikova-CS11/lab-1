import { ResourceEntity } from "../types/resource";

class ResourcesRepository {
    private items: ResourceEntity[] = [];

    findAll(): ResourceEntity[] {
        return [...this.items];
    }

    findById(id: string): ResourceEntity | undefined {
        return this.items.find((item) => item.id === id);
    }

    create(resource: ResourceEntity): ResourceEntity {
        this.items.push(resource);
        return resource;
    }

    update(id: string, changes: Partial<ResourceEntity>): ResourceEntity | null {
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

export const resourcesRepository = new ResourcesRepository();