/*
https://docs.nestjs.com/providers#services
*/

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestHeaders } from 'axios';
import { firstValueFrom } from 'rxjs';
import { Owner, Account } from '../../../shared/interfaces/monzo';

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

@Injectable()
export class MonzoService {
  constructor(private httpService: HttpService) {}

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

  async getAccountId({ authToken }: { authToken: string }): Promise<string> {
    const headers: AxiosRequestHeaders = {
      Authorization: `Bearer ${authToken}`,
    };

    const { data } = await firstValueFrom(
      this.httpService.get<{ accounts: Account[] }>('accounts?account_type=uk_retail', { headers }),
    );

    return data.accounts.find((acc) => !acc.closed).id;
  }

  async getUserInfo({ authToken }: { authToken: string }): Promise<Owner> {
    const headers: AxiosRequestHeaders = {
      Authorization: `Bearer ${authToken}`,
    };

    const { data } = await firstValueFrom(
      this.httpService.get<{ accounts: Account[] }>('accounts?account_type=uk_retail', { headers }),
    );

    return data.accounts[0].owners[0];
  }

  async configureWebhooks({
    authToken,
    accountId,
    webhookUrl,
  }: {
    authToken: string;
    accountId: string;
    webhookUrl: string;
  }): Promise<boolean> {
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
