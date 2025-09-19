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
exports.getClubsRoutes = void 0;
const express_1 = require("express");
const repositories_1 = require("../repositories");
const express_validator_1 = require("express-validator");
const middlewares_1 = require("../middlewares");
const middlewares_2 = require("../middlewares");
// const nameValidator = body('name')
//   .trim()
//   .isString()
//   .isLength({min: 3, max: 30})
//   .withMessage({
//     message: 'Name should be from 3 to 30 characters',
//   });
// const urlValidator = body('url').trim().isURL().withMessage({
//   message: 'Url should be correct',
// });
const getClubsRoutes = () => {
    const clubsRouter = (0, express_1.Router)();
    const clubRepository = new repositories_1.ClubRepository();
    // clubsRouter.use(authMiddleware);
    clubsRouter
        .get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const allClubs = yield clubRepository.findClubs(req.query.name);
        res.send(allClubs);
    }))
        .get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const foundClub = yield clubRepository.findClubById(+req.params.id);
        if (!foundClub) {
            res.sendStatus(404);
            return;
        }
        res.send(foundClub);
    }))
        .post('/', middlewares_2.authMiddleware, (0, express_validator_1.checkSchema)({
        name: {
            trim: true,
            isLength: { options: { min: 3, max: 30 } },
            isString: true,
            errorMessage: { message: 'Name should be from 3 to 30 characters' },
        },
        url: {
            trim: true,
            isURL: true,
            errorMessage: { message: 'Url should be correct' },
        },
    }), middlewares_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const createdClub = yield clubRepository.createClub(req.body.name, req.body.url);
        if (!createdClub) {
            res.sendStatus(400);
            return;
        }
        res.status(201).send(createdClub);
    }));
    return clubsRouter;
};
exports.getClubsRoutes = getClubsRoutes;
