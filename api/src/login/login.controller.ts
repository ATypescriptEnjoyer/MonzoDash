/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post } from '@nestjs/common';
import { MonzoService } from 'src/monzo/monzo.service';
import { LoginService } from './login.service';

@Controller('Login')
export class LoginController {
  constructor(private readonly loginService: LoginService, private readonly monzoService: MonzoService) {}

  @Get('auth-code')
  async getAuthCode(): Promise<void> {
    const generatedAuthCode = await this.loginService.createCode();
    await this.monzoService.sendNotification(
      `MonzoDash Auth Code - ${generatedAuthCode}`,
      `Please use this code to log in to MonzoDash!`,
    );
  }

  @Post('auth-code')
  async postAuthCode(@Body() { code }: { code: string }): Promise<boolean> {
    return await this.loginService.validateCode(code, true);
  }
}
