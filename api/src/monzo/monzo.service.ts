/*
https://docs.nestjs.com/providers#services
*/

import { RedisService } from '@liaoliaots/nestjs-redis';
import { HttpService } from '@nestjs/axios';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AxiosRequestHeaders } from 'axios';
import { firstValueFrom } from 'rxjs';
import { Owner, Account } from '../../../shared/interfaces/monzo';
import { buildStorage, setupCache } from 'axios-cache-interceptor';
import { AuthService } from '../auth/auth.service';

export interface MonzoAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface AuthRequest {
  authCode: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface Balances {
  balance: number;
  total_balance: number;
  currency: string;
  spend_today: number;
}

@Injectable()
export class MonzoService {
  constructor(
    private httpService: HttpService,
    private redisService: RedisService,
    @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
  ) {
    const client = redisService.getClient();
    const redisStorage = buildStorage({
      async find(key) {
        const result = await client.get(`axios-cache:${key}`);
        return JSON.parse(result);
      },

      async set(key, value) {
        await client.set(`axios-cache:${key}`, JSON.stringify(value));
      },

      async remove(key) {
        await client.del(`axios-cache:${key}`);
      },
    });

    setupCache(httpService.axiosRef, {
      storage: redisStorage,
    });
  }

  async usingAuthCode({ authCode }: AuthRequest): Promise<AuthResponse> {
    const {
      MONZO_CLIENT_ID: clientId,
      MONZO_CLIENT_SECRET: clientSecret,
      MONZO_REDIRECT_URI: redirectUri,
    } = process.env;

    const requestData = {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: authCode,
    };

    const requestDataString = new URLSearchParams(requestData).toString();

    const { data } = await firstValueFrom(this.httpService.post<MonzoAuthResponse>('oauth2/token', requestDataString));

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in, //Expires in is in seconds
      refreshToken: data.refresh_token,
    };
  }

  async refreshToken({ refreshToken }: { refreshToken: string }): Promise<AuthResponse> {
    const { MONZO_CLIENT_ID: clientId, MONZO_CLIENT_SECRET: clientSecret } = process.env;

    const requestData = {
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    };

    const requestDataString = new URLSearchParams(requestData).toString();

    const { data } = await firstValueFrom(this.httpService.post<MonzoAuthResponse>('oauth2/token', requestDataString));
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in, //Expires in is in seconds
      refreshToken: data.refresh_token,
    };
  }

  async getAccountId(): Promise<string> {
    const authToken = (await this.authService.getLatestToken()).authToken;

    const headers: AxiosRequestHeaders = {
      Authorization: `Bearer ${authToken}`,
    };

    const { data } = await firstValueFrom(
      this.httpService.get<{ accounts: Account[] }>('accounts?account_type=uk_retail', { headers }),
    );

    return data.accounts.find((acc) => !acc.closed).id;
  }

  async getUserInfo(): Promise<Owner> {
    const authToken = (await this.authService.getLatestToken()).authToken;

    const headers: AxiosRequestHeaders = {
      Authorization: `Bearer ${authToken}`,
    };

    const { data } = await firstValueFrom(
      this.httpService.get<{ accounts: Account[] }>('accounts?account_type=uk_retail', { headers }),
    );

    return data.accounts[0].owners[0];
  }

  async getBalance(): Promise<number> {
    const authToken = (await this.authService.getLatestToken()).authToken;

    const headers: AxiosRequestHeaders = {
      Authorization: `Bearer ${authToken}`,
    };

    const accountId = await this.getAccountId();

    const { data } = await firstValueFrom(
      this.httpService.get<Balances>(`balance?account_id=${accountId}`, { headers }),
    );

    return data.balance;
  }

  async signOut(): Promise<string> {
    return this.redisService.getClient().flushall();
  }

  async configureWebhooks({ accountId, webhookUrl }: { accountId: string; webhookUrl: string }): Promise<boolean> {
    const authToken = (await this.authService.getLatestToken()).authToken;

    const headers: AxiosRequestHeaders = {
      Authorization: `Bearer ${authToken}`,
    };

    try {
      await firstValueFrom(this.httpService.post('webhooks', { account_id: accountId, url: webhookUrl }, { headers }));
      return true;
    } catch (error) {
      return false;
    }
  }
}
