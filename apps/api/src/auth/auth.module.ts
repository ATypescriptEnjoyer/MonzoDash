import { forwardRef, Module } from '@nestjs/common';
import { LoginModule } from '../login/login.module';
import { MonzoModule } from '../monzo/monzo.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthSchema } from './schemas/auth.schema';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AuthSchema]), forwardRef(() => MonzoModule), LoginModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
