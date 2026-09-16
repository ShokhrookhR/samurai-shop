import {IFeedback} from '../types';
import {FeedbackModel} from './db';
import {ObjectId} from 'mongodb';

export class FeedbackRepository {
    private model: typeof FeedbackModel;

    constructor() {
        this.model = FeedbackModel;
    }

    async addFeedback(message: string, userId: ObjectId): Promise<IFeedback | null> {
        const createdFeedback = await this.model.create({
            message,
            userId,
            createdAt: new Date(),
        });
        return this.mapToFeedback(createdFeedback);
    }

    private mapToFeedback(dbObject: {
        _id: unknown;
        message: string;
        userId: ObjectId;
        createdAt: Date;
    }): IFeedback {
        return {
            uid: String(dbObject._id),
            message: dbObject.message,
            userId: dbObject.userId,
            createdAt: dbObject.createdAt,
        };
    }
}
