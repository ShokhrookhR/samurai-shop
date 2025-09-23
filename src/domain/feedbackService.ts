import {FeedbackRepository} from '../repositories';

export class FeedbackService {
  constructor() {
    this.repository = new FeedbackRepository();
  }
  private repository: FeedbackRepository;
  async addFeedback(message: string, userId: string) {
    return await this.repository.addFeedback(message, userId);
  }
}
