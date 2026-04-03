import { CommentEntity } from "../types/comment";

class CommentsRepository {
    private items: CommentEntity[] = [];

    findAll(): CommentEntity[] {
        return [...this.items];
    }

    findById(id: string): CommentEntity | undefined {
        return this.items.find((item) => item.id === id);
    }

    create(comment: CommentEntity): CommentEntity {
        this.items.push(comment);
        return comment;
    }

    update(id: string, changes: Partial<CommentEntity>): CommentEntity | null {
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

export const commentsRepository = new CommentsRepository();