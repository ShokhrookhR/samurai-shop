import {NextFunction, Request, Response} from 'express';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization === 'Basic S3VrdTpsdWx1') {
    next();
    return;
  }
  res.sendStatus(401);
};
