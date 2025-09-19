import {Router} from 'express';
import {UserService} from '../domain';

export const getAuthRoutes = () => {
  const authRouter = Router();
  const userService = new UserService();
  authRouter
    .post('/login', async (req, res) => {
      console.log('Auth routes');
      const isValid = await userService.checkCredentials(req.body);
      if (!isValid) {
        res.sendStatus(404);
        return;
      }
      res.sendStatus(200);
    })
    .post('/register', async (req, res) => {
      const createdUser = await userService.createUser(req.body);
      if (!createdUser) {
        res.sendStatus(400);
        return;
      }
      res.status(201).send(createdUser.token);
    });
  return authRouter;
};
