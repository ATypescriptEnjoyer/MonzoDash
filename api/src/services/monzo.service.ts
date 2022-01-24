/*
https://docs.nestjs.com/providers#services
*/

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export interface MonzoAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: string;
}

export interface AuthRequest {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authCode: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

@Injectable()
export class MonzoService {
  constructor(private httpService: HttpService) {}

  async usingAuthCode({ clientId, clientSecret, redirectUri, authCode }: AuthRequest): Promise<AuthResponse> {
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
}
