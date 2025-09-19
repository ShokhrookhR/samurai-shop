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
exports.ProductsRepository = void 0;
const db_1 = require("./db");
class ProductsRepository {
    constructor() {
        this.collection = db_1.productsCollection;
    }
    findProducts(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (title) {
                filter.title = { $regex: title };
            }
            return yield this.collection.find(filter).toArray();
        });
    }
    findProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundProduct = yield this.collection.findOne({ id });
            return foundProduct;
        });
    }
    createProduct(newProduct) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.collection.insertOne({
                id: newProduct.id,
                title: newProduct.title,
            });
            return newProduct;
        });
    }
}
exports.ProductsRepository = ProductsRepository;
