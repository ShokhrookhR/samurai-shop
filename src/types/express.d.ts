// types/express/index.d.ts (или прямо в любом .d.ts файле проекта)
import 'express';
import {IUser} from './user';
import {WithId} from 'mongodb';

declare global {
  namespace Express {
    interface Request {
      user?: WithId<IUser>;
    }
  }
}
