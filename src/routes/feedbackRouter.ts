import {FeedbackService} from '../domain';
import {Router} from 'express';
import {authMiddleware} from '../middlewares';

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
      res.status(400).send({message: 'Feedback not created'});
      return;
    }
    res.status(201).send(feedback);
  });
  return router;
};
