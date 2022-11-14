import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { LoginService } from './login.service';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  constructor(private readonly loginService: LoginService, private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const latestToken = await this.authService.getLatestToken();
    if (latestToken) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new HttpException('Login Required', HttpStatus.UNAUTHORIZED);
      }
      const codeIsValid = await this.loginService.validateCode(authHeader);
      if (!codeIsValid) {
        throw new HttpException('Login Required', HttpStatus.UNAUTHORIZED);
      }
    }

    next();
  }
}
