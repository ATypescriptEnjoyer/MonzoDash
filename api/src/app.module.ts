import { MonzoController } from './controllers/monzo.controller';
import { MonzoService } from './services/monzo.service';
import { AuthController } from './controllers/auth.controller';
import { PrismaService } from './services/prisma.service';
import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AutomationRecordService } from './services/automationRecord.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '../.env' }),
    HttpModule.register({ baseURL: 'https://api.monzo.com/' }),
  ],
  controllers: [MonzoController, AuthController],
  providers: [MonzoService, AuthService, PrismaService, AutomationRecordService],
})
export class AppModule {}
