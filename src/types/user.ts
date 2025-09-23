export interface IUser {
  _id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}
