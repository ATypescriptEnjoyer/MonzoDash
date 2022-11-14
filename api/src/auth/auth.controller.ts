/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  forwardRef,
  Get,
  HttpException,
  Inject,
  InternalServerErrorException,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MonzoService } from '../monzo/monzo.service';
import { Auth } from './schemas/auth.schema';
import { LoginService } from 'src/login/login.service';

@Controller('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loginService: LoginService,
    @Inject(forwardRef(() => MonzoService)) private readonly monzoService: MonzoService,
  ) {}

  @Get('redirectUri')
  getRedirectUri(): string {
    const { MONZO_CLIENT_ID: clientId, MONZODASH_DOMAIN } = process.env;
    const redirectUri = `${MONZODASH_DOMAIN}/api/auth/callback`;
    return `https://auth.monzo.com?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
  }

  @Get('callback')
  async handleCallback(
    @Res() response: { redirect: (uri: string) => void },
    @Query('code') code: string,
  ): Promise<void> {
    try {
      const authResponse = await this.monzoService.usingAuthCode({
        authCode: code,
      });

      const expiresIn = new Date();
      expiresIn.setSeconds(+expiresIn.getSeconds() + authResponse.expiresIn);

      const record: Auth = {
        authToken: authResponse.accessToken,
        refreshToken: authResponse.refreshToken,
        createdAt: new Date(),
        expiresIn,
        twoFactored: false,
      };
      await this.authService.deleteAll();
      await this.authService.create(record);
      const loginCode = await this.loginService.createCode();
      return response.redirect(`/login/verify?code=${loginCode}`);
    } catch (error) {
      throw new InternalServerErrorException(error.response.data);
    }
  }

  @Get('isAuthed')
  async isAuthed(): Promise<boolean> {
    try {
      const token = await this.authService.getLatestToken();
      return token?.twoFactored ? !!token : false;
    } catch (error) {
      if (error instanceof HttpException) {
        await this.authService.deleteAll();
        throw new HttpException('Auth Failure', error.getStatus());
      }
    }
  }

  @Post('signout')
  async signOut(): Promise<void> {
    await this.authService.deleteAll();
    await this.loginService.deleteAll();
    await this.monzoService.signOut();
  }

  @Get('verified')
  async verified(): Promise<boolean> {
    const token = await this.authService.getLatestToken();
    if (!token) {
      return false;
    }
    try {
      if (token.twoFactored) {
        return true;
      }
      const userInfo = await this.monzoService.getAccountId();
      await this.monzoService.configureWebhooks({
        accountId: userInfo,
        webhookUrl: `${process.env.MONZODASH_WEBHOOK_DOMAIN}/api/monzo/webhook`,
      });
      token.twoFactored = true;
      await this.authService.save(token);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
