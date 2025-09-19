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
exports.AuthRepository = void 0;
const db_1 = require("./db");
class AuthRepository {
    constructor() {
        this.collection = db_1.authCollection;
    }
    findUserByUsername(_a) {
        return __awaiter(this, arguments, void 0, function* ({ usernameOrEmail }) {
            console.log('usernameOrEmail', usernameOrEmail);
            const foundUser = yield this.collection.findOne({
                // $or: [{usernameOrEmail}, {email: usernameOrEmail}],
                usernameOrEmail,
            });
            console.log('foundUser', foundUser);
            return foundUser;
        });
    }
}
exports.AuthRepository = AuthRepository;
