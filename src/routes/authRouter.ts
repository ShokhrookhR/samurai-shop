import {IAuthInputModel} from '../models/authInputModel';
import {Router, Request, Response} from 'express';
import {AuthService} from '../domain';
import {JWTService} from '../application/jwtService';
import {HTTP_STATUSES} from '../constants/httpStatuses';

export const getAuthRoutes = () => {
  const authRouter = Router();
  const authService = new AuthService();
  const jwtService = new JWTService();
  authRouter
    .post('/login', async (req, res) => {
      const user = await authService.checkCredentials(req.body);
      if (!user) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
      }
      const token = jwtService.createJWT({
        userId: user._id,
        username: user.accountData.username,
      });
      res.send({accessToken: token});
    })
    .post(
      '/confirm-email',
      async (req: Request<{}, {}, {}, IAuthInputModel['query']>, res) => {
        const isConfirmed = await authService.confirmEmail(req.query.code);
        if (!isConfirmed) {
          res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
          return;
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
      }
    )
    .post(
      '/register',
      async (req: Request<{}, IAuthInputModel['body']>, res: Response) => {
        const createdUser = await authService.createUser(req.body);
        if (!createdUser) {
          res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
          return;
        }
        // const token = jwtService.createJWT({
        //   userId: createdUser._id,
        //   username: createdUser.accountData.username,
        // });
        res.status(HTTP_STATUSES.CREATED_201).send({success: true});
      }
    );
  return authRouter;
};
