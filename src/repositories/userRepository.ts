import {ObjectId, WithId} from 'mongodb';
import {UserModel} from './db';
import {IUser} from '../types';

export class UserRepository {
    constructor() {
        this.collection = UserModel;
    }

    private collection;

    async findUserByUsernameOrEmail({
                                        usernameOrEmail,
                                    }: {
        usernameOrEmail: string;
    }) {
        return await this.collection.findOne({
            $or: [
                {'accountData.username': usernameOrEmail},
                {'accountData.email': usernameOrEmail},
            ],
        });
    }

    async findById(id: ObjectId) {
        return await this.collection.findOne({_id: new ObjectId(id)});
    }

    async findByCode(code: string): Promise<WithId<IUser> | null> {
        return await this.collection.findOne({
            'emailConfirmation.confirmationCode': code,
        });
    }

    async createUser(newUser: IUser): Promise<IUser | null> {
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
