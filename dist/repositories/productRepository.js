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
exports.ProductRepository = void 0;
const db_1 = require("./db");
class ProductRepository {
    constructor() {
        this.collectionRead = db_1.productCollectionRead;
        this.collectionWrite = db_1.productsCollectionWrite;
    }
    findProducts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (query.title) {
                filter.title = { $regex: query.title };
            }
            const productsCount = yield this.collectionRead.countDocuments();
            console.log(query.sortBy === 'asc' ? 1 : -1);
            console.log(this.calculateSkip(+query.page, +query.size));
            const productsFromDB = yield this.collectionRead
                .find(filter)
                .sort({ title: query.sortBy === 'asc' ? 1 : -1 })
                .skip(this.calculateSkip(+query.page, +query.size))
                .limit(+query.size)
                .toArray();
            const mappedProducts = productsFromDB.map((product) => {
                return this.mapToProduct(product);
            });
            const responseBody = {
                data: mappedProducts,
                totalCount: productsCount,
            };
            return responseBody;
        });
    }
    findProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundProduct = yield this.collectionRead.findOne({ id });
            return foundProduct;
        });
    }
    createProduct(newProduct) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertDoc = {
                id: newProduct.id,
                title: newProduct.title,
                price: newProduct.price,
            };
            yield this.collectionWrite.insertOne(insertDoc);
            return newProduct;
        });
    }
    mapToProduct(dbObject) {
        return {
            id: dbObject.id,
            uid: dbObject._id,
            title: dbObject.title,
            price: dbObject.price,
        };
    }
    calculateSkip(page, size) {
        return ((page || 1) - 1) * size;
    }
}
exports.ProductRepository = ProductRepository;
