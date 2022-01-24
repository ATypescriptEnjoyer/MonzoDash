import { AuthController } from './controllers/auth.controller';
import { PrismaService } from './services/prisma.service';
import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AuthService } from './services/auth.service';
import { AutomationRecordService } from './services/automationRecord.service';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [ ConfigModule.forRoot({envFilePath: "../.env"}) ],
  controllers: [
    AuthController, AppController],
  providers: [
    AuthService,
    PrismaService,
    AutomationRecordService],
})
export class AppModule { }
