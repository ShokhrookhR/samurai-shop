import {Router} from 'express';
import {checkSchema} from 'express-validator';
import {authMiddleware, inputValidationMiddleware} from '../middlewares';
import {ClubController} from '../controllers';

export const getClubRoutes = () => {
    const clubsRouter = Router();
    const clubController = new ClubController();

    clubsRouter
        .get('/', clubController.getClubs)
        .get('/:uid', clubController.getClubByUId)
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
            clubController.createClub
        );
    return clubsRouter;
};
