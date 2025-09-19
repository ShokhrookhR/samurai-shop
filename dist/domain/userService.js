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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const userRepository_1 = require("../repositories/userRepository");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    constructor() {
        this.repository = new userRepository_1.UserRepository();
    }
    checkCredentials(_a) {
        return __awaiter(this, arguments, void 0, function* ({ usernameOrEmail, password, }) {
            const foundUser = yield this.repository.findUserByUsernameOrEmail({
                usernameOrEmail,
            });
            if (!foundUser)
                return false;
            return yield bcrypt_1.default.compare(password, foundUser === null || foundUser === void 0 ? void 0 : foundUser.passwordHash);
        });
    }
    createUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ username, email, password, }) {
            const saltRounds = 10;
            const passwordHash = yield this._hashPassword(password, saltRounds);
            const newUser = {
                username,
                email,
                passwordHash,
                createdAt: new Date(),
            };
            return yield this.repository.createUser(newUser);
        });
    }
    _hashPassword(password, saltRounds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.hash(password, saltRounds);
        });
    }
}
exports.UserService = UserService;
