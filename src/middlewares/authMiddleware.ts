import {NextFunction, Request, Response} from 'express';
import {JWTService} from '../application/jwtService';
import {AuthService} from '../domain';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }
  const jwtService = new JWTService();
  const authService = new AuthService();
  const userId = jwtService.getUserIdByToken(token);
  if (!userId) {
    return res.sendStatus(401);
  }
  const user = await authService.findUserById(userId);
  if (!user) {
    res.sendStatus(401);
    return;
  }
  req.user = user;
  next();
};
