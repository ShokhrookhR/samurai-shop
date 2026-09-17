import {Router} from 'express';
import {authMiddleware} from '../middlewares';
import {FeedbackController} from '../controllers';

export const getFeedbackRoutes = () => {
  const router = Router();
  const feedbackController = new FeedbackController();
  router.post('/', authMiddleware, feedbackController.addFeedback);
  return router;
};
