import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getHello(): Promise<string> {
    const authRecord = await this.authService.createAuthRecord({
      type: 'AUTH',
      value: "Test Auth Record"
    });
    return `Record Created ID: ${authRecord.id}`;
  }
}
