import {ObjectId} from 'mongodb';
import {UserRepository} from '../repositories/userRepository';
import bcrypt from 'bcrypt';

export class UserService {
  constructor() {
    this.repository = new UserRepository();
  }
  private repository: UserRepository;
  async checkCredentials({
    usernameOrEmail,
    password,
  }: {
    usernameOrEmail: string;
    password: string;
  }) {
    const foundUser = await this.repository.findUserByUsernameOrEmail({
      usernameOrEmail,
    });
    if (!foundUser) return false;
    const isValid = await bcrypt.compare(password, foundUser?.passwordHash);

    if (!isValid) {
      return null;
    }
    return foundUser;
  }
  async createUser({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) {
    const saltRounds = 10;
    const passwordHash = await this._hashPassword(password, saltRounds);
    const newUser = {
      username,
      email,
      passwordHash,
      createdAt: new Date(),
    };
    return await this.repository.createUser(newUser);
  }
  async findUserById(userId: ObjectId) {
    return await this.repository.findById(userId);
  }
  async _hashPassword(password: string, saltRounds: number): Promise<string> {
    return await bcrypt.hash(password, saltRounds);
  }
}
