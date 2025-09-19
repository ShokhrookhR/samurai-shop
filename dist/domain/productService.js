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
exports.ProductService = void 0;
const productRepository_1 = require("../repositories/productRepository");
// import {productsCollection} from './db';
class ProductService {
    constructor() {
        this.repository = new productRepository_1.ProductRepository();
    }
    findProducts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findProducts(query);
        });
    }
    findProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundProduct = yield this.repository.findProductById(id);
            return foundProduct;
        });
    }
    createProduct(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const newProduct = {
                id: +new Date(),
                title: payload.title,
                price: payload.price,
            };
            yield this.repository.createProduct(newProduct);
            return newProduct;
        });
    }
}
exports.ProductService = ProductService;
