/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get } from '@nestjs/common';
import { Owner } from '../../../shared/interfaces/monzo';
import { MonzoService } from './monzo.service';

@Controller('monzo')
export class MonzoController {
  constructor(private readonly monzoService: MonzoService) {}

  @Get('getUser')
  async getUser(): Promise<Owner> {
    const userInfo = await this.monzoService.getUserInfo();
    return userInfo;
  }
}
