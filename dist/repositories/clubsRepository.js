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
exports.ClubsRepository = void 0;
const db = {
    clubs: [
        { id: 1, name: 'Manchester United', url: 'https://www.manutd.com/' },
        { id: 2, name: 'PSG', url: 'https://www.kuku.com/' },
        { id: 3, name: 'Chicago Bulls', url: 'https://www.kuku.com/' },
        { id: 4, name: 'LA Lakers', url: 'https://www.kuku.com/' },
        { id: 5, name: 'Westham United', url: 'https://www.kuku.com/' },
    ],
};
class ClubsRepository {
    constructor() { }
    findClubs(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundClubsQuery = db.clubs;
            if (name) {
                foundClubsQuery = db.clubs.filter((club) => club.name.indexOf(name) !== -1);
            }
            return foundClubsQuery;
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
    createClub(name, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const newClub = {
                id: +new Date(),
                name: name,
                url: url,
            };
            db.clubs.push(newClub);
            return newClub;
        });
    }
}
exports.ClubsRepository = ClubsRepository;
