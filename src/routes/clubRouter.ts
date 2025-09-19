import {Response, Router, type Request} from 'express';
import {ClubRepository} from '../repositories';
import {IClubInputBodyModel, IClubInputModel} from '../models/clubInputModel';
import {body, checkSchema} from 'express-validator';
import {inputValidationMiddleware} from '../middlewares';
import {authMiddleware} from '../middlewares';
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
export const getClubRoutes = () => {
  const clubsRouter = Router();
  const clubRepository = new ClubRepository();
  // clubsRouter.use(authMiddleware);
  clubsRouter
    .get('/', async (req: Request<{}, {}, {}, IClubInputModel>, res) => {
      const allClubs = await clubRepository.findClubs(req.query.name);
      res.send(allClubs);
    })
    .get('/:id', async (req: Request<{id: string}>, res) => {
      const foundClub = await clubRepository.findClubById(+req.params.id);
      if (!foundClub) {
        res.sendStatus(404);
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
      async (req: Request<{}, IClubInputBodyModel>, res: Response) => {
        const createdClub = await clubRepository.createClub(
          req.body.name,
          req.body.url
        );
        if (!createdClub) {
          res.sendStatus(400);
          return;
        }
        res.status(201).send(createdClub);
      }
    );
  return clubsRouter;
};
