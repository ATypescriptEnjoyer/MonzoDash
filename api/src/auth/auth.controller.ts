/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, forwardRef, Get, Inject, InternalServerErrorException, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MonzoService } from '../monzo/monzo.service';
import { Auth } from './schemas/auth.schema';

@Controller('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(forwardRef(() => MonzoService)) private readonly monzoService: MonzoService,
  ) {}

  @Get('redirectUri')
  getRedirectUri(): string {
    const { MONZO_CLIENT_ID: clientId, MONZO_REDIRECT_URI: redirectUri } = process.env;
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
      return response.redirect(process.env.MONZODASH_FRONTEND_URL);
    } catch (error) {
      throw new InternalServerErrorException(error.response.data);
    }
  }

  @Get('isAuthed')
  async isAuthed(): Promise<boolean> {
    const token = await this.authService.getLatestToken();
    return token?.twoFactored ? !!token : false;
  }

  @Post('signout')
  async signOut(): Promise<void> {
    await this.authService.deleteAll();
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
      const userInfo = await this.monzoService.getAccountId({ authToken: token.authToken });
      await this.monzoService.configureWebhooks({
        authToken: token.authToken,
        accountId: userInfo,
        webhookUrl: process.env.MONZO_WEBHOOK_URI,
      });
      await this.authService.save({ ...token, twoFactored: true });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
