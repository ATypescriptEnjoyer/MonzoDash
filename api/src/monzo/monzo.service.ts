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
import async from 'async';

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

export interface Pot {
  id: string;
  name: string;
}

export interface PotsResponse {
  pots: (Pot & { deleted: boolean })[];
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
        await client.set(`axios-cache:${key}`, JSON.stringify(value), 'EX', 5 * 60); //5 min expiration
      },

      async remove(key) {
        await client.del(`axios-cache:${key}`);
      },
    });

    setupCache(httpService.axiosRef, {
      storage: redisStorage,
      methods: ['get'],
    });
  }

  async usingAuthCode({ authCode }: AuthRequest): Promise<AuthResponse> {
    const { MONZO_CLIENT_ID: clientId, MONZO_CLIENT_SECRET: clientSecret, MONZODASH_DOMAIN } = process.env;

    const redirectUri = `${MONZODASH_DOMAIN}/api/auth/callback`;

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

  async getPots(): Promise<Pot[]> {
    const authToken = (await this.authService.getLatestToken()).authToken;

    const headers: AxiosRequestHeaders = {
      Authorization: `Bearer ${authToken}`,
    };

    const accountId = await this.getAccountId();

    const { data } = await firstValueFrom(
      this.httpService.get<PotsResponse>(`pots?current_account_id=${accountId}`, { headers }),
    );

    return data.pots.filter((pot) => !pot.deleted).map(({ id, name }) => ({ id, name }));
  }

  async depositToPot(potId: string, valuePence: number): Promise<Pot> {
    const authToken = (await this.authService.getLatestToken()).authToken;

    const headers: AxiosRequestHeaders = {
      Authorization: `Bearer ${authToken}`,
    };

    const accountId = await this.getAccountId();

    const requestData = { source_account_id: accountId, amount: Math.abs(valuePence) as any, dedupe_id: potId };
    const requestDataString = new URLSearchParams(requestData).toString();

    const { data } = await firstValueFrom(
      this.httpService.put<Pot>(`pots/${potId}/deposit`, requestDataString, { headers }),
    );

    return data;
  }

  async withdrawFromPot(potId: string, valuePence: number): Promise<Pot> {
    const authToken = (await this.authService.getLatestToken()).authToken;

    const headers: AxiosRequestHeaders = {
      Authorization: `Bearer ${authToken}`,
    };

    const accountId = await this.getAccountId();

    const requestData = { destination_account_id: accountId, amount: Math.abs(valuePence) as any, dedupe_id: potId };
    const requestDataString = new URLSearchParams(requestData).toString();

    const { data } = await firstValueFrom(
      this.httpService.put<Pot>(`pots/${potId}/withdraw`, requestDataString, { headers }),
    );

    return data;
  }

  async sendNotification(title: string, message: string): Promise<void> {
    const authToken = (await this.authService.getLatestToken()).authToken;

    const headers: AxiosRequestHeaders = {
      Authorization: `Bearer ${authToken}`,
    };

    const accountId = await this.getAccountId();

    const imageUrl =
      'https://raw.githubusercontent.com/SashaRyder/MonzoDash/master/client/src/components/AppBar/monzodash.png?raw=true';

    const requestData = { account_id: accountId, type: 'basic' };
    const requestDataString = `${new URLSearchParams(
      requestData,
    ).toString()}&params[title]=${title}&params[image_url]=${imageUrl}&params[body]=${message}`;

    await firstValueFrom(this.httpService.post(`feed`, requestDataString, { headers }));
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
      const { data } = await firstValueFrom(this.httpService.get(`webhooks?account_id=${accountId}`, { headers }));
      const hooks: { webhooks: { id: string; url: string }[] } = data;
      let hookExists = false;
      await async.eachSeries(hooks.webhooks, async (hook) => {
        if (hook.url === webhookUrl) {
          hookExists = true;
        } else {
          await firstValueFrom(this.httpService.delete(`webhooks/${hook.id}`, { headers }));
        }
      });
      if (!hookExists) {
        const requestData = { account_id: accountId, url: webhookUrl };
        const requestDataString = new URLSearchParams(requestData).toString();
        await firstValueFrom(this.httpService.post('webhooks', requestDataString, { headers }));
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
