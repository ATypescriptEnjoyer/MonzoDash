/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller("Auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get("redirectUri")
    getRedirectUri(): string {
        const clientId = process.env.MONZO_CLIENT_ID;
        const redirectUri = process.env.MONZO_REDIRECT_URI;
        return `https://auth.monzo.com?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`
    }

    @Get("callback")
    handleCallback(): string {
        return "";
    }
}
