import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MonzoModule } from '../monzo/monzo.module';
import { DashModule } from '../dash/dash.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const username = configService.get<string>('MONGO_USERNAME');
        const password = configService.get<string>('MONGO_PASSWORD');
        return {
          uri: `mongodb://${username}:${password}@mongo/monzodash?authSource=admin`,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    MonzoModule,
    DashModule,
  ],
})
export class AppModule {}
