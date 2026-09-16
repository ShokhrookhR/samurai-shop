import {ObjectId} from 'mongodb';

export interface IFeedback {
  uid?: string;
  message: string;
  userId: ObjectId;
  createdAt: Date;
}
