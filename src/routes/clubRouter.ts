import {Response, Router, type Request} from 'express';
import {IClubInputBodyModel, IClubInputModel} from '../models/clubInputModel';
import {checkSchema} from 'express-validator';
import {authMiddleware, inputValidationMiddleware} from '../middlewares';
import {ClubService} from '../domain';
import {HTTP_STATUSES} from '../constants';

export const getClubRoutes = () => {
    const clubsRouter = Router();
    const clubService = new ClubService();

    clubsRouter
        .get('/', async (req: Request<{}, {}, {}, IClubInputModel>, res) => {
            const allClubs = await clubService.findClubs(req.query.name);
            res.send(allClubs);
        })
        .get('/:uid', async (req: Request<{uid: string}>, res) => {
            const foundClub = await clubService.findClubByUId(req.params.uid);
            if (!foundClub) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            res.send(foundClub);
        })
        .post(
            '/',
            authMiddleware,
            checkSchema({
                name: {
                    trim: true,
                    isLength: {options: {min: 3, max: 30}},
                    isString: true,
                    errorMessage: {message: 'Name should be from 3 to 30 characters'},
                },
                url: {
                    trim: true,
                    isURL: true,
                    errorMessage: {message: 'Url should be correct'},
                },
            }),
            inputValidationMiddleware,
            async (req: Request<{}, {}, IClubInputBodyModel>, res: Response) => {
                const createdClub = await clubService.createClub(
                    req.body.name,
                    req.body.url
                );
                if (!createdClub) {
                    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                    return;
                }
                res.status(HTTP_STATUSES.CREATED_201).send(createdClub);
            }
        );
    return clubsRouter;
};
