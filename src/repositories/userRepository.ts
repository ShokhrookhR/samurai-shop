import { ObjectId, WithId } from "mongodb";
import { UserModel } from "./db";
import { IUser } from "../types";

export class UserRepository {
  constructor() {
    this.collection = UserModel;
  }

  private collection;

  async findUserByUsernameOrEmail({ usernameOrEmail }: { usernameOrEmail: string }) {
    return await this.collection.findOne({
      $or: [{ "accountData.username": usernameOrEmail }, { "accountData.email": usernameOrEmail }],
    });
  }

  async findById(id: ObjectId) {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async findByCode(code: string): Promise<WithId<IUser> | null> {
    return await this.collection.findOne({
      "emailConfirmation.confirmationCode": code,
    });
  }

  async createUser(newUser: IUser): Promise<WithId<IUser> | null> {
    const foundUser = await this.collection.exists({
      $or: [
        { "accountData.username": newUser.accountData.username },
        // { "accountData.email": newUser.accountData.email },
      ],
    });

    if (foundUser) {
      return null;
    }
    try {
      const createdUser = await this.collection.create(newUser);
      return createdUser.toObject();
    } catch (error) {
      // Unique index violation: a concurrent request registered the same username/email
      if (error instanceof Error && "code" in error && error.code === 11000) {
        return null;
      }
      throw error;
    }
  }

  async deleteById(id: ObjectId) {
    return await this.collection.deleteOne({ _id: id });
  }

  async updateConfirmation(userId: ObjectId) {
    return await this.collection.updateOne(
      { _id: userId },
      { $set: { "emailConfirmation.isConfirmed": true } },
    );
  }
}
