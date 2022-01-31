import { MonzoController } from './controllers/monzo.controller';
import { MonzoService } from './services/monzo.service';
import { AuthController } from './controllers/auth.controller';
import { PrismaService } from './services/prisma.service';
import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AutomationRecordService } from './services/automationRecord.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { setupCache, RedisStore } from 'axios-cache-adapter';
import * as redis from 'redis';

const generateHttpModule = async (): Promise<DynamicModule> => {
  const client = redis.createClient({
    url: process.env.REDIS_URL,
  });

  const store = new RedisStore(client);
  const excludeOAuthRegex = new RegExp('oauth2');
  const cache = setupCache({
    maxAge: 15 * 60 * 1000,
    store: store,
    exclude: { query: false, paths: [excludeOAuthRegex] },
  });

  return HttpModule.register({ baseURL: 'https://api.monzo.com/', adapter: cache.adapter });
};

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '../.env' }), generateHttpModule()],
  controllers: [MonzoController, AuthController],
  providers: [MonzoService, AuthService, PrismaService, AutomationRecordService],
})
export class AppModule {}
