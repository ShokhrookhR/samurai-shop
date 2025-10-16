import {IUser} from '../types/user';
import {ObjectId, WithId} from 'mongodb';
import {UserRepository} from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import {add} from 'date-fns';
import {EmailManager} from '../managers';

export class AuthService {
    private repository: UserRepository;
    private emailManager: EmailManager;

    constructor() {
        this.repository = new UserRepository();
        this.emailManager = new EmailManager();
    }

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
        if (!foundUser.emailConfirmation.isConfirmed) return false;
        const isValid = await bcrypt.compare(
            password,
            foundUser?.accountData?.passwordHash
        );

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
            accountData: {
                username,
                email,
                passwordHash,
                createdAt: new Date(),
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {minutes: 3}),
                isConfirmed: false,
            },
        };
        const createUserResult = await this.repository.createUser(newUser);

        try {
            await this.emailManager.sendEmailConfirmationMessage(newUser);
        } catch (error) {
            return null;
        }
        return createUserResult;
    }

    async findUserById(userId: ObjectId) {
        return await this.repository.findById(userId);
    }

    async findUserByCode(code: string) {
        return await this.repository.findByCode(code);
    }

    async _hashPassword(password: string, saltRounds: number): Promise<string> {
        return await bcrypt.hash(password, saltRounds);
    }

    async confirmEmail(code: string) {
        const user: WithId<IUser> | null = await this.findUserByCode(code);

        if (!user) return false;
        if (user.emailConfirmation.isConfirmed) return false;
        if (user.emailConfirmation.confirmationCode !== code) return false;
        if (user.emailConfirmation.expirationDate < new Date()) return false;
        await this.repository.updateConfirmation(user._id);
        return true;
    }
}
