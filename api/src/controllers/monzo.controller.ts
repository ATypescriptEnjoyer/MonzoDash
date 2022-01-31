/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Owner } from '../../../shared/interfaces/monzo';
import { MonzoService } from '../services/monzo.service';

@Controller('monzo')
export class MonzoController {
  constructor(private readonly authService: AuthService, private readonly monzoService: MonzoService) {}

  @Get('getUser')
  async getUser(): Promise<Owner> {
    const token = await this.authService.getAccessToken();
    const userInfo = await this.monzoService.getUserInfo({ authToken: token });
    return userInfo;
  }
}
