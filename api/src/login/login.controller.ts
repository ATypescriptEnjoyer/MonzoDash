/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { MonzoService } from 'src/monzo/monzo.service';
import { LoginService } from './login.service';
import axios from 'axios';

@Controller('Login')
export class LoginController {
  constructor(private readonly loginService: LoginService, private readonly monzoService: MonzoService) {}

  @Get('auth-code')
  async getAuthCode(): Promise<void> {
    const generatedAuthCode = await this.loginService.createCode();

    try {
      await this.monzoService.sendNotification(
        `MonzoDash Auth Code - ${generatedAuthCode}`,
        `Please use this code to log in to MonzoDash!`,
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          //Auth Expired
          throw new HttpException('Monzo Authentication Expired.', 403);
        }
      }
    }
  }

  @Post('auth-code')
  async postAuthCode(@Body() { code }: { code: string }): Promise<boolean> {
    return await this.loginService.validateCode(code, true);
  }
}
