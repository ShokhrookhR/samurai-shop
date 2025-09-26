import nodemailer from 'nodemailer';
export class EmailAdapter {
  async sendEmail(to: string, subject: string, message: string): Promise<any> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });
    const emailOptions = {
      from: `Shokh <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: message,
    };
    try {
      return await transporter.sendMail(emailOptions);
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
