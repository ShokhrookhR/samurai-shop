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
exports.ClubsInDBRepository = void 0;
const db_1 = require("./db");
const db = {
    clubs: [
        { id: 1, name: 'Manchester United', url: 'https://www.manutd.com/' },
        { id: 2, name: 'PSG', url: 'https://www.kuku.com/' },
        { id: 3, name: 'Chicago Bulls', url: 'https://www.kuku.com/' },
        { id: 4, name: 'LA Lakers', url: 'https://www.kuku.com/' },
        { id: 5, name: 'Westham United', url: 'https://www.kuku.com/' },
    ],
};
db_1.productsCollection;
class ClubsInDBRepository {
    constructor() {
        this.collection = db_1.productsCollection;
    }
    findClubs(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (title) {
                filter.title = { $regex: title };
            }
            return yield this.collection.find(filter).toArray();
        });
    }
    findClubById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundClub = db.clubs.find((club) => club.id === id);
            if (!foundClub) {
                return null;
            }
            return foundClub;
        });
    }
    createClub(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const newProduct = {
                id: +new Date(),
                title: title,
            };
            const result = yield this.collection.insertOne({ id: newProduct.id, title });
            // db.clubs.push(newClub);
            return newProduct;
        });
    }
}
exports.ClubsInDBRepository = ClubsInDBRepository;
