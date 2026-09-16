import {IUser} from '../types';
import mongoose from 'mongoose'

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017';

const productsSchema = new mongoose.Schema({
    title: {type: String, required: true},
    price: {type: Number, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true},
});
const clubsSchema = new mongoose.Schema({
    name: {type: String, required: true},
    url: {type: String, required: true},
});
const feedbackSchema = new mongoose.Schema({
    message: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true},
    createdAt: {type: Date, required: true},
});
const userSchema = new mongoose.Schema<IUser>({
    accountData: {
        username: {type: String, required: true, unique: true},
        email: {type: String, required: true, unique: true},
        passwordHash: {type: String, required: true},
        createdAt: Date,
    },
    emailConfirmation: {confirmationCode: String, isConfirmed: Boolean, expirationDate: Date},
});
export const ProductModel = mongoose.model('Products', productsSchema);
export const UserModel = mongoose.model('Users', userSchema);
export const ClubModel = mongoose.model('Clubs', clubsSchema);
export const FeedbackModel = mongoose.model('Feedbacks', feedbackSchema);

export async function runDB() {
    try {
        await mongoose.connect(mongoURI + '/myShop')
        console.log('Connected successfully to mongo server');
    } catch (error) {
        await mongoose.disconnect()
        throw new Error('Cannot connect to db', {cause: error});
    }
}
