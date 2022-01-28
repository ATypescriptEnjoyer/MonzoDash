/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, InternalServerErrorException, Post, Query, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { MonzoService } from '../services/monzo.service';

@Controller('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly monzoService: MonzoService) {}

  @Post('redirectUri')
  getRedirectUri(): string {
    const { MONZO_CLIENT_ID: clientId, MONZO_REDIRECT_URI: redirectUri } = process.env;
    return `https://auth.monzo.com?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
  }

  @Get('callback')
  async handleCallback(
    @Res() response: { redirect: (uri: string) => void },
    @Query('code') code: string,
  ): Promise<void> {
    const {
      MONZO_CLIENT_ID: clientId,
      MONZO_CLIENT_SECRET: clientSecret,
      MONZO_REDIRECT_URI: redirectUri,
    } = process.env;
    try {
      const authResponse = await this.monzoService.usingAuthCode({
        clientId,
        clientSecret,
        redirectUri,
        authCode: code,
      });

      const expiresIn = new Date();
      expiresIn.setSeconds(+expiresIn.getSeconds() + authResponse.expiresIn);

      const record = {
        authToken: authResponse.accessToken,
        refreshToken: authResponse.refreshToken,
        expiresIn,
      };
      await this.authService.createAuthRecord(record);
      return response.redirect(process.env.MONZOMATION_FRONTEND_URL);
    } catch (error) {
      throw new InternalServerErrorException(error.response.data);
    }
  }
}
