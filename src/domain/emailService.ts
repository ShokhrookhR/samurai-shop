import {EmailManager} from '../managers';

export class EmailService {
  constructor() {
    this.emailManager = new EmailManager();
  }
  private emailManager: EmailManager;
  async sendPasswordRecoveryEmail(): Promise<any> {
    return await this.emailManager.sendPasswordRecoveryMessage(
      'shokhrookh7997@gmail.com',
      'Kuku',
      '<h1>HTML version of the message</h1>'
    );
  }
}
