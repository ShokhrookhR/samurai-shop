import {FeedbackRepository} from '../repositories';
import {ObjectId} from 'mongodb';

export class FeedbackService {
  constructor() {
    this.repository = new FeedbackRepository();
  }
  private repository: FeedbackRepository;
  async addFeedback(message: string, userId: ObjectId) {
    return await this.repository.addFeedback(message, userId);
  }
}
