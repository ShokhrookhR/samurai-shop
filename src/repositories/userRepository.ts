import {ObjectId, WithId} from 'mongodb';
import {userCollection} from './db';
import {IUser} from '../types';

export class UserRepository {
  constructor() {
    this.collection = userCollection;
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
  async findById(id: ObjectId) {
    return await this.collection.findOne({_id: new ObjectId(id)});
  }
  async findByCode(code: string): Promise<WithId<IUser> | null> {
    return await this.collection.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }
  async createUser(newUser: IUser): Promise<WithId<IUser> | null> {
    const foundUser = await this.findUserByUsernameOrEmail({
      usernameOrEmail: newUser.accountData.username,
    });

    if (foundUser) {
      return null;
    }
    await this.collection.insertOne(newUser);

    return newUser as WithId<IUser>;
  }
  async updateConfirmation(userId: ObjectId) {
    return await this.collection.updateOne(
      {_id: userId},
      {$set: {'emailConfirmation.isConfirmed': true}}
    );
  }
}
