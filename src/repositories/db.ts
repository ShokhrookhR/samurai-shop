import {IDBProduct, IProduct} from '../types/product';
import {MongoClient} from 'mongodb';

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(mongoURI);
const myShopDB = client.db('myShop');
export const productsCollectionWrite =
  myShopDB.collection<IProduct>('products');
export const authCollection = myShopDB.collection('users');
export const feedbackCollection = myShopDB.collection('feedbacks');
export const productCollectionRead =
  myShopDB.collection<IDBProduct>('products');
export async function runDB() {
  try {
    await client.connect();
    await client.db('products').command({ping: 1});
    console.log('Connected successfully to mongo server');
  } catch (error) {
    client.close();
    console.log('Cannot connect to db', error);
  }
}
