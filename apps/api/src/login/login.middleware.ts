import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth/auth.service';
import { LoginService } from './login.service';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  constructor(
    private readonly loginService: LoginService,
    private readonly authService: AuthService,
  ) {}

  async use(req: Request, _: Response, next: NextFunction): Promise<void> {
    if (!req.headers.authorization) {
      throw new HttpException('Header "Authoriation" is required.', HttpStatus.FORBIDDEN);
    }
    const latestToken = await this.authService.getToken();
    if (latestToken) {
      const authIsValid = await this.loginService.validateCode(req.headers.authorization, false);
      if (!authIsValid) {
        throw new HttpException('Login Required', HttpStatus.UNAUTHORIZED);
      }
    }

    next();
  }
}
