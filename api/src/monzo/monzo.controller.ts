/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, forwardRef, Get, Inject } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Owner } from '../../../shared/interfaces/monzo';
import { MonzoService } from './monzo.service';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';

@Controller('monzo')
export class MonzoController {
  constructor(
    @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
    private readonly monzoService: MonzoService,
  ) {}

  @Get('getUser')
  async getUser(): Promise<Owner> {
    const token = await this.authService.getLatestToken();
    if (!token) {
      throw new UnauthorizedException();
    }
    const userInfo = await this.monzoService.getUserInfo({ authToken: token.authToken });
    return userInfo;
  }
}
