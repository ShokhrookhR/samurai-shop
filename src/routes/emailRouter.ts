import {Router} from 'express';
import nodemailer from 'nodemailer';
import {EmailService} from '../domain';
export const getEmailRoutes = () => {
  const router = Router();
  const emailService = new EmailService();
  router.post('/send', async (req, res) => {
    const sentEmail = await emailService.sendPasswordRecoveryEmail();

    if (!sentEmail) {
      res.status(401).send('Email not sent');
      return;
    }
    res.send('Email sent successfully');
  });
  return router;
};
