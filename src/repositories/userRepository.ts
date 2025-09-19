import {authCollection} from './db';
interface IUser {
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}
export class UserRepository {
  constructor() {
    this.collection = authCollection;
  }
  private collection;
  async findUserByUsernameOrEmail({
    usernameOrEmail,
  }: {
    usernameOrEmail: string;
  }) {
    const foundUser = await this.collection.findOne({
      $or: [{username: usernameOrEmail}, {email: usernameOrEmail}],
    });

    return foundUser;
  }
  async createUser(newUser: IUser) {
    const foundUser = await this.findUserByUsernameOrEmail({
      usernameOrEmail: newUser.username,
    });
    if (foundUser) {
      return null;
    }
    await this.collection.insertOne(newUser);

    return {token: 'kukuToken'};
  }
}
