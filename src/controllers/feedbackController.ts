import {Request, Response} from 'express';
import {FeedbackService} from '../domain';
import {HTTP_STATUSES} from '../constants';

export class FeedbackController {
    constructor() {
        this.service = new FeedbackService();
    }

    private readonly service: FeedbackService;

    addFeedback = async (req: Request, res: Response) => {
        const userId = req.user!._id;
        const feedback = await this.service.addFeedback(req.body.message, userId);
        if (!feedback) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send({message: 'Feedback not created'});
            return;
        }
        res.status(HTTP_STATUSES.CREATED_201).send(feedback);
    };
}
