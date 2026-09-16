import {FeedbackService} from '../domain';
import {Router} from 'express';
import {authMiddleware} from '../middlewares';
import {HTTP_STATUSES} from '../constants';

export const getFeedbackRoutes = () => {
  const router = Router();
  const feedbackService = new FeedbackService();
  router.post('/', authMiddleware, async (req, res) => {
    const userId = req.user!._id;
    const feedback = await feedbackService.addFeedback(
      req.body.message,
      userId
    );
    if (!feedback) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).send({message: 'Feedback not created'});
      return;
    }
    res.status(HTTP_STATUSES.CREATED_201).send(feedback);
  });
  return router;
};
