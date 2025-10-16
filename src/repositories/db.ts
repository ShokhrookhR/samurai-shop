import {IDBProduct, IProduct, IUser} from '../types';
import {MongoClient} from 'mongodb';
import mongoose from 'mongoose'

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(mongoURI);
const myShopDB = client.db('myShop');
export const userCollection = myShopDB.collection<IUser>('users');
export const feedbackCollection = myShopDB.collection('feedbacks');

const productsSchema = new mongoose.Schema({
    title: {type: String, required: true},
    price: {type: String, required: true}
});
const userSchema = new mongoose.Schema<IUser>({
    accountData: {username: String, passwordHash: String, email: String, createdAt: Date},
    emailConfirmation: {confirmationCode: String, isConfirmed: Boolean, expirationDate: Date},
});
export const ProductModel = mongoose.model('Products', productsSchema);
export const UserModel = mongoose.model('Users', userSchema);

export async function runDB() {
    try {
        await mongoose.connect(mongoURI + '/myShop')
        console.log('Connected successfully to mongo server');
    } catch (error) {
        await mongoose.disconnect()
        console.log('Cannot connect to db', error);
    }
}
