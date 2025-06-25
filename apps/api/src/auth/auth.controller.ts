/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, forwardRef, Get, Inject, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MonzoService } from '../monzo/monzo.service';
import { LoginService } from '../login/login.service';

const webhookDomain = process.env.MONZODASH_WEBHOOK_DOMAIN
  ? process.env.MONZODASH_WEBHOOK_DOMAIN
  : process.env.MONZODASH_DOMAIN;

@Controller('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loginService: LoginService,
    @Inject(forwardRef(() => MonzoService)) private readonly monzoService: MonzoService,
  ) { }

  @Get('redirectUri')
  getRedirectUri(): string {
    const { MONZO_CLIENT_ID, MONZODASH_DOMAIN } = process.env;
    const redirectUriParams = {
      client_id: MONZO_CLIENT_ID,
      redirect_uri: `${MONZODASH_DOMAIN}/api/auth/callback`,
      response_type: 'code',
      state: 'state',
    };
    const params = Object.entries(redirectUriParams)
      .map((entry) => entry.join('='))
      .join('&');
    return 'https://auth.monzo.com?' + params;
  }

  @Get('callback')
  async handleCallback(
    @Res() response: { redirect: (uri: string) => void },
    @Query('code') code: string,
  ): Promise<void> {
    const authResponse = await this.monzoService.usingAuthCode({
      authCode: code,
    });
    await this.authService.createToken(authResponse);
    const loginCode = await this.loginService.createCode();
    return response.redirect(`/login/verify?code=${loginCode}`);
  }

  @Get('isAuthed')
  async isAuthed(): Promise<{ error?: string; status: boolean }> {
    return this.monzoService.isAuthenticated();
  }

  @Post('signout')
  async signOut(): Promise<void> {
    await Promise.all([
      this.authService.deleteAll(),
      this.loginService.deleteAll(),
      this.monzoService.signOut(),
    ]);
  }

  @Get('verified')
  async verified(): Promise<boolean> {
    const token = await this.authService.getToken();
    if (!token) {
      return false;
    } else if (token.twoFactored) {
      return true;
    }
    const { status: isAuthenticated } = await this.monzoService.isAuthenticated();
    if (!isAuthenticated) {
      return false;
    }
    const userInfo = await this.monzoService.getAccountId();
    await this.monzoService.configureWebhooks({
      accountId: userInfo,
      webhookUrl: `${webhookDomain}/api/monzo/webhook`,
    });
    token.twoFactored = true;
    await this.authService.save(token);
    return true;
  }
}
