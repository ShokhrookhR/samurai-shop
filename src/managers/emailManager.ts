import {IUser} from '../types/user';
import {EmailAdapter} from '../adapters';

export class EmailManager {
  constructor() {
    this.emailAdapter = new EmailAdapter();
  }
  private emailAdapter: EmailAdapter;
  async sendPasswordRecoveryMessage(
    to: string,
    subject: string,
    message: string
  ) {
    return await this.emailAdapter.sendEmail(to, subject, message);
  }
  async sendEmailConfirmationMessage(user: IUser) {
    return await this.emailAdapter.sendEmail(
      user.accountData.email,
      user.emailConfirmation.confirmationCode,
      'Please confirm your email'
    );
  }
}
