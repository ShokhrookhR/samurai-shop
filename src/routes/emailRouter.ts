import {Router} from 'express';
import nodemailer from 'nodemailer';
export const getEmailRoutes = () => {
  const router = Router();
  router.post('/send', async (req, res) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });
    const emailOptions = {
      from: `Shokh <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'Kuku',
      // text: 'Plaintext version of the message',
      html: '<p>HTML version of the message</p>',
    };
    transporter.sendMail(emailOptions, (error, info) => {
      if (error) {
        console.log('Error occurred:', error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent successfully:', info.response);
        res.status(200).send('Email sent successfully');
      }
    });
  });
  return router;
};
