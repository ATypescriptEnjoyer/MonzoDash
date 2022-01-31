import { DynamicModule } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { setupCache, RedisStore } from 'axios-cache-adapter';
import * as redis from 'redis';

export const generateHttpModule = async (): Promise<DynamicModule> => {
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
