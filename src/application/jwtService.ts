import jwt from 'jsonwebtoken';
import {ObjectId} from 'mongodb';
export class JWTService {
  createJWT(payload: any) {
    const token = jwt.sign(payload, '123', {expiresIn: '1d'});
    return token;
  }
  getUserIdByToken(token: string) {
    try {
      const user = jwt.verify(token, '123');
      if (typeof user === 'object' && user !== null && 'userId' in user) {
        return new ObjectId((user as jwt.JwtPayload).userId);
      }
    } catch (error) {
      return null;
    }
  }
}
