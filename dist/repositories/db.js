"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productCollectionRead = exports.authCollection = exports.productsCollectionWrite = void 0;
exports.runDB = runDB;
const mongodb_1 = require("mongodb");
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new mongodb_1.MongoClient(mongoURI);
const myShopDB = client.db('myShop');
exports.productsCollectionWrite = myShopDB.collection('products');
exports.authCollection = myShopDB.collection('users');
exports.productCollectionRead = myShopDB.collection('products');
function runDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            yield client.db('products').command({ ping: 1 });
            console.log('Connected successfully to mongo server');
        }
        catch (error) {
            client.close();
            console.log('Cannot connect to db', error);
        }
    });
}
