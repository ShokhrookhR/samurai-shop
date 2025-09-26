import {Router} from 'express';
import nodemailer from 'nodemailer';
import {EmailService} from '../domain';
import {HTTP_STATUSES} from '../constants/httpStatuses';
export const getEmailRoutes = () => {
  const router = Router();
  const emailService = new EmailService();
  router.post('/send', async (req, res) => {
    const sentEmail = await emailService.sendPasswordRecoveryEmail();

    if (!sentEmail) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).send('Email not sent');
      return;
    }
    res.send('Email sent successfully');
  });
  return router;
};
