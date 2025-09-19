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
exports.getProductRoutes = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const middlewares_2 = require("../middlewares");
const domain_1 = require("../domain");
const getProductRoutes = () => {
    const productsRouter = (0, express_1.Router)();
    const productsService = new domain_1.ProductService();
    productsRouter
        .get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const allProducts = yield productsService.findProducts(req.query);
        res.send(allProducts);
    }))
        .get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const foundProduct = yield productsService.findProductById(+req.params.id);
        if (!foundProduct) {
            res.sendStatus(404);
            return;
        }
        res.send(foundProduct);
    }))
        .post('/', middlewares_2.authMiddleware, 
    // checkSchema({
    //   name: {
    //     trim: true,
    //     isLength: {options: {min: 3, max: 30}},
    //     isString: true,
    //     errorMessage: {message: 'Name should be from 3 to 30 characters'},
    //   },
    //   url: {
    //     trim: true,
    //     isURL: true,
    //     errorMessage: {message: 'Url should be correct'},
    //   },
    // }),
    middlewares_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const createdProduct = yield productsService.createProduct(req.body);
        if (!createdProduct) {
            res.sendStatus(400);
            return;
        }
        res.status(201).send(createdProduct);
    }));
    return productsRouter;
};
exports.getProductRoutes = getProductRoutes;
