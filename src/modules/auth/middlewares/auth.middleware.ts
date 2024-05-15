import { validateToken } from '@/v1/helpers/jwt';
import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly auth: AuthService) {}
  use(req: any, res: any, next: () => void) {
    let token =
      req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
      const bearerToken = req.headers['authorization'];
      if (bearerToken) {
        token = bearerToken.split(' ')[1];
      } else {
        throw new HttpException('Invalid JWT token', 401);
      }
    }
    try {
      const payload = validateToken(token);
      if (!payload) {
        throw new HttpException('Invalid JWT token', 401);
      }
      this.auth.setCurrentUserId(payload.id);
      this.auth.setCurrentUserName(payload.userName);
      next();
    } catch (e) {
      console.error(e);
      throw new HttpException('Invalid JWT token', 401);
    }
  }
}
