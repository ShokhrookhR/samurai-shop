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
exports.getAuthRoutes = void 0;
const express_1 = require("express");
const domain_1 = require("../domain");
const getAuthRoutes = () => {
    const authRouter = (0, express_1.Router)();
    const userService = new domain_1.UserService();
    authRouter
        .post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Auth routes');
        const isValid = yield userService.checkCredentials(req.body);
        if (!isValid) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(200);
    }))
        .post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield userService.createUser(req.body);
        if (!createdUser) {
            res.sendStatus(400);
            return;
        }
        res.status(201).send(createdUser.token);
    }));
    return authRouter;
};
exports.getAuthRoutes = getAuthRoutes;
