/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, InternalServerErrorException, Post, Query, Res } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from '../services/auth.service';
import { MonzoService } from '../services/monzo.service';

@Controller('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly monzoService: MonzoService) { }

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

      const record: Prisma.AuthCreateInput = {
        authToken: authResponse.accessToken,
        refreshToken: authResponse.refreshToken,
        expiresIn,
        twoFactored: false,
      };
      await this.authService.clearAuthRecords();
      await this.authService.createAuthRecord(record);
      return response.redirect(process.env.MONZOMATION_FRONTEND_URL);
    } catch (error) {
      throw new InternalServerErrorException(error.response.data);
    }
  }

  @Get('isAuthed')
  async isAuthed(): Promise<boolean> {
    const token = await this.authService.getAccessToken();
    return token?.twoFactored ? !!token : false;
  }

  @Post('signout')
  async signOut(): Promise<void> {
    await this.authService.clearAuthRecords();
  }

  @Get('checkTwoFactor')
  async checkTwoFactor(): Promise<boolean> {
    const token = await this.authService.getAccessToken();
    try {
      await this.monzoService.getUserInfo({ authToken: token.authToken });
      await this.authService.updateAuthRecord({
        data: {
          twoFactored: true,
        },
        where: {
          authToken: token.authToken,
        },
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
