import jwt from 'jsonwebtoken';
import {ObjectId} from 'mongodb';
export class JWTService {
  private readonly secret: string;
  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    this.secret = secret;
  }
  createJWT(payload: any) {
    const token = jwt.sign(payload, this.secret, {expiresIn: '1d'});
    return token;
  }
  getUserIdByToken(token: string) {
    try {
      const user = jwt.verify(token, this.secret);
      if (typeof user === 'object' && user !== null && 'userId' in user) {
        return new ObjectId((user as jwt.JwtPayload).userId);
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
