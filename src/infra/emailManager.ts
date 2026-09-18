import { IUser } from "../types/user";
import { EmailAdapter } from "./emailAdapter";

export class EmailManager {
  constructor() {
    // this.emailAdapter = new EmailAdapter();
  }
  // private emailAdapter: EmailAdapter;
  // async sendEmailConfirmationMessage(user: IUser) {
  //   const { confirmationCode } = user.emailConfirmation;
  //   return await this.emailAdapter.sendEmail(
  //     user.accountData.email,
  //     "Please confirm your email",
  //     `<h1>Thanks for your registration</h1>
  //      <p>Your confirmation code: <b>${confirmationCode}</b></p>`,
  //   );
  // }
}
