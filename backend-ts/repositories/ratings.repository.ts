import { RatingEntity } from "../types/rating";

class RatingsRepository {
    private items: RatingEntity[] = [];

    findAll(): RatingEntity[] {
        return [...this.items];
    }

    findById(id: string): RatingEntity | undefined {
        return this.items.find((item) => item.id === id);
    }

    findByUserAndResource(userId: string, resourceId: string): RatingEntity | undefined {
        return this.items.find(
            (item) => item.userId === userId && item.resourceId === resourceId
        );
    }

    create(rating: RatingEntity): RatingEntity {
        this.items.push(rating);
        return rating;
    }

    update(id: string, changes: Partial<RatingEntity>): RatingEntity | null {
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

export const ratingsRepository = new RatingsRepository();