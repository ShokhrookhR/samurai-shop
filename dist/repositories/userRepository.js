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
exports.UserRepository = void 0;
const db_1 = require("./db");
class UserRepository {
    constructor() {
        this.collection = db_1.authCollection;
    }
    findUserByUsernameOrEmail(_a) {
        return __awaiter(this, arguments, void 0, function* ({ usernameOrEmail, }) {
            const foundUser = yield this.collection.findOne({
                $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
            });
            return foundUser;
        });
    }
    createUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.findUserByUsernameOrEmail({
                usernameOrEmail: newUser.username,
            });
            if (foundUser) {
                return null;
            }
            yield this.collection.insertOne(newUser);
            return { token: 'kukuToken' };
        });
    }
}
exports.UserRepository = UserRepository;
