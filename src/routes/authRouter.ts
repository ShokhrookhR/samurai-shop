import {Router} from 'express';
import {UserService} from '../domain';
import {JWTService} from '../application/jwtService';

export const getAuthRoutes = () => {
  const authRouter = Router();
  const userService = new UserService();
  const jwtService = new JWTService();
  authRouter
    .post('/login', async (req, res) => {
      const user = await userService.checkCredentials(req.body);
      if (!user) {
        res.sendStatus(401);
        return;
      }
      const token = jwtService.createJWT({
        userId: user._id,
        username: user.username,
      });
      res.send(token);
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
