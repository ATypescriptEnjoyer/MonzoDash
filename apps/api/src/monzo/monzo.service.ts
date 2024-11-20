/*
https://docs.nestjs.com/providers#services
*/

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Owner, Account } from './monzo.interfaces';
import { AuthService } from '../auth/auth.service';
import async from 'async';
import { v4 as uuidv4 } from 'uuid';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { LoginService } from '../login/login.service';
import { isAxiosError } from 'axios';

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
  balance: number;
  deleted?: boolean;
}

export interface PotsResponse {
  pots: Pot[];
}

@Injectable()
export class MonzoService {
  constructor(
    private httpService: HttpService,
    private loginService: LoginService,
    @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
  ) {}

  private async getHeaders(): Promise<Record<string, string> | undefined> {
    const authToken = (await this.authService.getToken())?.authToken;

    if (authToken) {
      return {
        authorization: `Bearer ${authToken}`,
      };
    }
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
    const headers = await this.getHeaders();

    const { data } = await firstValueFrom(
      this.httpService.get<{ accounts: Account[] }>('accounts?account_type=uk_retail', {
        headers,
      }),
    );
    return data.accounts.find((acc) => !acc.closed).id;
  }

  async getUserInfo(): Promise<Owner> {
    const headers = await this.getHeaders();

    const { data } = await firstValueFrom(
      this.httpService.get<{ accounts: Account[] }>('accounts?account_type=uk_retail', {
        headers,
      }),
    );
    return data.accounts[0].owners[0];
  }

  async getBalance(): Promise<number> {
    const headers = await this.getHeaders();

    const accountId = await this.getAccountId();

    const { data } = await firstValueFrom(
      this.httpService.get<Balances>(`balance?account_id=${accountId}`, { headers }),
    );
    return data.balance;
  }

  async getPots(): Promise<Pot[]> {
    const headers = await this.getHeaders();
    if (!headers) {
      return [];
    }

    const accountId = await this.getAccountId();

    const { data } = await firstValueFrom(
      this.httpService.get<PotsResponse>(`pots?current_account_id=${accountId}`, { headers }),
    );
    return data.pots.filter((pot) => !pot.deleted).map(({ id, name, balance }) => ({ id, name, balance }));
  }

  async depositToPot(potId: string, valuePence: number, accountId: string): Promise<Pot> {
    const headers = await this.getHeaders();

    const requestData = {
      source_account_id: accountId,
      amount: Math.abs(valuePence) as unknown as string,
      dedupe_id: uuidv4(),
    };
    const requestDataString = new URLSearchParams(requestData).toString();

    const { data } = await firstValueFrom(
      this.httpService.put<Pot>(`pots/${potId}/deposit`, requestDataString, { headers }),
    );
    return data;
  }

  async withdrawFromPot(potId: string, valuePence: number, accountId: string): Promise<Pot> {
    const headers = await this.getHeaders();

    const requestData = {
      destination_account_id: accountId,
      amount: Math.abs(valuePence) as unknown as string,
      dedupe_id: uuidv4(),
    };
    const requestDataString = new URLSearchParams(requestData).toString();

    const { data } = await firstValueFrom(
      this.httpService.put<Pot>(`pots/${potId}/withdraw`, requestDataString, { headers }),
    );
    return data;
  }

  async sendNotification(title: string, message: string): Promise<void> {
    const headers = await this.getHeaders();

    const accountId = await this.getAccountId();

    const imageUrl = 'https://github.com/SashaRyder/MonzoDash/blob/master/client/public/icon-192x192.png?raw=true';

    const requestData = { account_id: accountId, type: 'basic' };
    const requestDataString = `${new URLSearchParams(
      requestData,
    ).toString()}&params[title]=${title}&params[image_url]=${imageUrl}&params[body]=${message}`;

    await firstValueFrom(this.httpService.post(`feed`, requestDataString, { headers }));
  }

  async signOut(): Promise<void> {
    await Promise.all([this.authService.deleteAll(), this.loginService.deleteAll()]);
  }

  async configureWebhooks({ accountId, webhookUrl }: { accountId: string; webhookUrl: string }): Promise<boolean> {
    const headers = await this.getHeaders();

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
    } catch {
      return false;
    }
  }

  async isAuthenticated() {
    const headers = await this.getHeaders();
    if (!headers) {
      return {
        status: false,
        error: 'Auth Token not present',
      };
    }

    const { data } = await firstValueFrom(this.httpService.get<{ authenticated: boolean }>('ping/whoami', { headers }));
    if (!data.authenticated) {
      return {
        status: false,
        error: 'Auth token no longer valid',
      };
    }
    try {
      await this.getAccountId();
      return { status: true };
    } catch (error) {
      if (isAxiosError(error) && error.status === 403) {
        return {
          status: false,
          error: '2FA Pending',
        };
      }
      return {
        status: false,
        error: error,
      };
    }
  }
}
