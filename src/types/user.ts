export interface IUser {
  // _id?: string;
  accountData: IAccountData;
  emailConfirmation: IEmailConfirmation;
}
interface IAccountData {
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}
interface IEmailConfirmation {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
}
