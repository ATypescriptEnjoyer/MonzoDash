/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, InternalServerErrorException, Query } from '@nestjs/common';
import moment from 'moment';
import { AuthService } from '../services/auth.service';
import { MonzoService } from '../services/monzo.service';

@Controller('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly monzoService: MonzoService) {}

  @Get('redirectUri')
  getRedirectUri(): string {
    const { MONZO_CLIENT_ID: clientId, MONZO_REDIRECT_URI: redirectUri } = process.env;
    return `https://auth.monzo.com?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
  }

  @Get('callback')
  async handleCallback(@Query('code') code: string): Promise<void> {
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
      await this.authService.createAuthRecord({
        authToken: authResponse.accessToken,
        refreshToken: authResponse.refreshToken,
        expiresIn: moment().add(authResponse.expiresIn, 'seconds').toDate(),
      });
    } catch (error) {
      throw new InternalServerErrorException(error.response.data);
    }
  }
}
